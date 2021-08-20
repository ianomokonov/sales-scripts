<?php
header("Access-Control-Allow-Origin: https://info-ecology.com/back/controller.php");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

require_once 'vendor/autoload.php';
require_once './utils/database.php';
require_once './utils/token.php';
require_once './models/user.php';

use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Response as ResponseClass;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;
use Slim\Routing\RouteCollectorProxy;
use Slim\Routing\RouteContext;

$dataBase = new DataBase();
$token = new Token();
$app = AppFactory::create();
$app->setBasePath(rtrim($_SERVER['PHP_SELF'], '/index.php'));

// Add error middlewar
$app->addErrorMiddleware(true, true, true);
// Add routes
$app->post('/login', function (Request $request, Response $response) use ($dataBase) {

    $user = new User($dataBase);
    $requestData = $request->getParsedBody();
    try {
        $response->getBody()->write(json_encode($user->login($requestData['email'], $requestData['password'])));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Пользователь не найден")));
        return $response->withStatus(401);
    }
});

$app->get('/test', function (Request $request, Response $response) use ($dataBase) {

    try {
        $response->getBody()->write(json_encode(array("message" => "Success", "request" => $request->getQueryParams())));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Ошибка", "error" => $e)));
        return $response->withStatus(401);
    }
});

$app->post('/sign-up', function (Request $request, Response $response) use ($dataBase) {
    $user = new User($dataBase);
    try {
        $response->getBody()->write(json_encode($user->create((object) $request->getParsedBody())));
        return $response;
    } catch (Exception $e) {
        $response->getBody()->write(json_encode(array("message" => "Пользователь уже существует")));
        return $response->withStatus(401);
    }
});

$app->post('/refresh-token', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->refreshToken($request->getParsedBody()['token'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(401);
    }
});

$app->post('/update-password', function (Request $request, Response $response) use ($dataBase) {
    try {
        $user = new User($dataBase);
        $response->getBody()->write(json_encode($user->getUpdateLink($request->getParsedBody()['email'])));
        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => $e->getMessage())));
        return $response->withStatus(500);
    }
});

$app->group('/', function (RouteCollectorProxy $group) use ($dataBase) {
    $group->group('user',  function (RouteCollectorProxy $userGroup) use ($dataBase) {

        $userGroup->get('/user-info', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->read($userId)));
            return $response;
        });

        $userGroup->get('/check-admin', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->checkAdmin($userId)));
            return $response;
        });

        $userGroup->post('/update-user-info', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            if (isset($_FILES['image'])) {
                $response->getBody()->write(json_encode($user->update($userId, $request->getParsedBody(), $_FILES['image'])));
            } else {
                $response->getBody()->write(json_encode($user->update($userId, $request->getParsedBody())));
            }

            return $response;
        });

        $userGroup->post('/send-message', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->sendMessage($userId, $request->getParsedBody())));
            return $response;
        });

        $userGroup->post('/update-password', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->updatePassword($userId, $request->getParsedBody()['password'])));
            return $response;
        });

        $userGroup->post('/delete-token', function (Request $request, Response $response) use ($dataBase) {
            $userId = $request->getAttribute('userId');
            $user = new User($dataBase);
            $response->getBody()->write(json_encode($user->removeRefreshToken($userId)));
            return $response;
        });
    });

    $group->group('admin', function (RouteCollectorProxy $adminGroup) use ($dataBase) {
    })->add(function (Request $request, RequestHandler $handler) use ($dataBase) {
        $userId = $request->getAttribute('userId');

        $user = new User($dataBase);

        if ($user->checkAdmin($userId)) {
            return $handler->handle($request);
        }

        $response = new ResponseClass();
        $response->getBody()->write(json_encode(array("message" => "Отказано в доступе к функционалу администратора")));
        return $response->withStatus(403);
    });
})->add(function (Request $request, RequestHandler $handler) use ($token) {
    try {
        $jwt = explode(' ', $request->getHeader('Authorization')[0])[1];
        $userId = $token->decode($jwt)->data->id;
        $request = $request->withAttribute('userId', $userId);
        $response = $handler->handle($request);

        return $response;
    } catch (Exception $e) {
        $response = new ResponseClass();
        echo json_encode($e);
        $response->getBody()->write(json_encode($e));
        if ($e->getCode() && $e->getCode() != 0) {
            return $response->withStatus($e->getCode());
        }
        return $response->withStatus(500);
    }
});

$app->run();
