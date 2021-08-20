<?php
require_once __DIR__ . '/../utils/database.php';
require_once __DIR__ . '/../utils/token.php';
require_once __DIR__ . '/../utils/filesUpload.php';
class User
{
    private $dataBase;
    private $table = 'jungleUser';
    private $token;
    private $fileUploader;
    // private $baseUrl = 'http://localhost:4200';
    private $baseUrl = 'http://jungliki.com';

    // конструктор класса User 
    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
        $this->token = new Token();
        $this->fileUploader = new FilesUpload();
    }

    public function create($userData)
    {
        $password = htmlspecialchars(strip_tags($userData->password));
        unset($userData->password);
        $userData = $this->dataBase->stripAll((array)$userData);
        $password = password_hash($password, PASSWORD_BCRYPT);
        if ($this->EmailExists($userData['email'])) {
            throw new Exception('Пользователь уже существует');
        }
        // Вставляем запрос
        $userData['password'] = json_encode($password);
        $query = $this->dataBase->genInsertQuery(
            $userData,
            $this->table
        );

        // подготовка запроса 
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        $userId = $this->dataBase->db->lastInsertId();
        if ($userId) {
            $tokens = $this->token->encode(array("id" => $userId));
            $this->addRefreshToken($tokens[1], $userId);
            return $tokens;
        }
        return null;
    }

    // Получение пользовательской информации
    public function read($userId)
    {
        return null;
    }

    // Получение пользовательской информации

    public function update($userId, $userData, $image = null)
    {
    }

    public function getUsers()
    {
        $query = "SELECT id, name, surname, hasDiscount FROM " . $this->table;
        $stmt = $this->dataBase->db->query($query);
        $users = [];
        while ($user = $stmt->fetch()) {
            $user = $this->dataBase->decode($user);
            $users[] = $user;
        }
        return $users;
    }

    public function checkAdmin($userId)
    {
        $query = "SELECT isAdmin FROM $this->table WHERE id = $userId";
        $stmt = $this->dataBase->db->query($query);
        if ($stmt->fetch()['isAdmin']) {
            return true;
        }
        return false;
    }

    public function getUserImage($userId)
    {
        $query = "SELECT image FROM $this->table WHERE id = $userId";
        $stmt = $this->dataBase->db->query($query);

        return $stmt->fetch()['image'];
    }

    public function login($email, $password)
    {
        if ($email != null) {
            $sth = $this->dataBase->db->prepare("SELECT id, password FROM " . $this->table . " WHERE email = ? LIMIT 1");
            $sth->execute(array(json_encode($email)));
            $fullUser = $this->dataBase->decode($sth->fetch());
            if ($fullUser) {
                if (!password_verify($password, $fullUser['password'])) {
                    throw new Exception("User not found", 404);
                }
                $tokens = $this->token->encode(array("id" => $fullUser['id']));
                $this->addRefreshToken($tokens[1], $fullUser['id']);
                return $tokens;
            } else {
                throw new Exception("User not found", 404);
            }
        } else {
            return array("message" => "Введите данные для регистрации");
        }
    }

    public function isRefreshTokenActual($token, $userId)
    {
        $query = "SELECT id FROM refreshTokens WHERE token = ? AND userId = ?";

        // подготовка запроса 
        $stmt = $this->dataBase->db->prepare($query);
        // инъекция 
        $token = htmlspecialchars(strip_tags($token));
        $userId = htmlspecialchars(strip_tags($userId));
        // выполняем запрос 
        $stmt->execute(array($token, $userId));

        // получаем количество строк 
        $num = $stmt->rowCount();

        if ($num > 0) {
            return true;
        }

        return $num > 0;
    }

    // Обновление пароля
    public function updatePassword($userId, $password)
    {
        if ($userId) {
            $password = json_encode(password_hash($password, PASSWORD_BCRYPT));
            $query = "UPDATE $this->table SET password = '$password' WHERE id=$userId";
            $stmt = $this->dataBase->db->query($query);
        } else {
            return array("message" => "Токен неверен");
        }
    }

    // Отправление сообщений

    public function sendMessage($userId, $request)
    {
        $request = $this->dataBase->stripAll($request);
        $request['userId'] = $userId;
        $query = $this->dataBase->genInsertQuery(
            $request,
            'messages'
        );
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
    }

    public function addRefreshToken($tokenn, $userId)
    {
        $query = "INSERT INTO refreshTokens (token, userId) VALUES ('$tokenn', $userId)";
        $this->dataBase->db->query($query);
    }

    public function removeRefreshToken($userId)
    {
        $query = "DELETE FROM refreshTokens WHERE userId = $userId";
        $this->dataBase->db->query($query);
    }

    public function refreshToken($token)
    {
        $userId = $this->token->decode($token, true)->data->id;

        if (!$this->isRefreshTokenActual($token, $userId)) {
            throw new Exception("Unauthorized", 401);
        }

        $this->removeRefreshToken($userId);

        $tokens = $this->token->encode(array("id" => $userId));
        $this->addRefreshToken($tokens[1], $userId);
        return $tokens;
    }

    public function getUpdateLink($email)
    {
        $userId = $this->EmailExists($email);
        $path = 'logs.txt';

        if (!$userId) {
            throw new Exception("Bad request", 400);
        }

        $tokens = $this->token->encode(array("id" => $userId));
        $url = $this->baseUrl . "/update?updatePassword=" . urlencode($tokens[0]);
        $subject = "Изменение пароля для jungliki.com";

        $message = "<h2>Чтобы изменить пароль перейдите по ссылке <a href='$url'>$url</a>!</h2>";

        $headers  = "Content-type: text/html; charset=utf-8 \r\n";

        mail($email, $subject, $message, $headers);
        file_put_contents($path, PHP_EOL . $email . " " . date("m.d.y H:i:s"), FILE_APPEND);
        return true;
    }

    private function EmailExists(string $email)
    {
        $query = "SELECT id FROM " . $this->table . " WHERE email = ?";

        // подготовка запроса 
        $stmt = $this->dataBase->db->prepare($query);
        // инъекция 
        $email = json_encode(htmlspecialchars(strip_tags($email)));
        // выполняем запрос 
        $stmt->execute(array($email));

        // получаем количество строк 
        $num = $stmt->rowCount();

        if ($num > 0) {
            return $stmt->fetch()['id'];
        }

        return $num > 0;
    }
}