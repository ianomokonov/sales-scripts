<?php
require_once __DIR__ . '/../utils/database.php';
class Block
{
    private $dataBase;
    private $table = 'Block';
    // private $baseUrl = 'http://localhost:4200/back';
    private $baseUrl = 'http://stand1.progoff.ru/back';

    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
    }

    public function create($request)
    {
        $request = $this->dataBase->stripAll((array)$request);
        $query = $this->dataBase->genInsertQuery(
            $request,
            $this->table
        );

        // подготовка запроса
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        return $this->dataBase->db->lastInsertId();
    }

    public function createTransition($blockId, $request)
    {
        if ($request['block']) {
            $request['nextBlockId'] = $this->create($request['block']);
            unset($request['block']);
        }
        $request['blockId'] = $blockId;
        $request = $this->dataBase->stripAll((array)$request);
        $query = $this->dataBase->genInsertQuery(
            $request,
            'Transition'
        );

        // подготовка запроса
        $stmt = $this->dataBase->db->prepare($query[0]);
        if ($query[1][0] != null) {
            $stmt->execute($query[1]);
        }
        return $this->dataBase->db->lastInsertId();
    }

    public function delete($blockId)
    {
        $query = "delete from Block where id=?";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($blockId));
        return true;
    }

    public function markBlock($blockId, $request)
    {
        if ($request['isFavorite']) {
            $query = "insert into UserScriptFavorite (userScriptId, blockId) VALUES (?, ?)";
            $stmt = $this->dataBase->db->prepare($query);
            $stmt->execute(array($request['userScriptId'], $blockId));
            return true;
        }
        $query = "delete from UserScriptFavorite where userScriptId=? AND blockId=?";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($request['userScriptId'], $blockId));
        return true;
    }
}
