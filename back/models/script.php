<?php
require_once __DIR__ . '/../utils/database.php';
class Script
{
    private $dataBase;
    private $table = 'Script';
    // private $baseUrl = 'http://localhost:4200/back';
    private $baseUrl = 'http://stand1.progoff.ru/back';

    public function __construct(DataBase $dataBase)
    {
        $this->dataBase = $dataBase;
    }

    public function read($userScriptId) {
        $query = "SELECT * FROM $this->table s JOIN UserScript us ON s.id=us.scriptId WHERE us.id='$userScriptId'";
        $script = $this->dataBase->db->query($query)->fetch();
        $script['blocks'] = $this->readBlocks($userScriptId, $script['id']);
        return $script;
    }

    public function readBlocks($scriptId, $userScriptId) {
        $query = "SELECT b.id, b.name, b.description, b.createDate, b.lastModifyDate, b.createDate, b.lastModifyUserId, b.blockIndex, (SELECT count(*) FROM UserScriptFavorite usf WHERE usf.userScriptId=? AND usf.blockId=b.id) as isFavorite FROM Block b WHERE b.scriptId=? ORDER BY b.blockIndex";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($userScriptId, $scriptId));
        $blocks = [];
        while($block = $stmt->fetch()){
            $block['isFavorite'] = $block['isFavorite'] == '1';
            $block['blockIndex'] = $block['blockIndex'] * 1;
            $block['id'] = $block['id'] * 1;
            $blocks[] = $block;
        }
        return $blocks;
    }

    public function deleteBlock($blockId) {
        $query = "delete from Block where id=?";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($blockId));
        return true;
    }

    public function markBlock($blockId, $request) {
        if($request['isFavorite']){
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

    public function sortBlocks($blocks) {
        foreach ($blocks as $block) {
            $query = "update Block set blockIndex=? where id=?";
            $stmt = $this->dataBase->db->prepare($query);
            $stmt->execute(array($block['index'], $block['id']));
        }
        return true;
    }
}