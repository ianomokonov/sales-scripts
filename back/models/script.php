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
    public function getFolders($userId)
    {
        $query = "SELECT s.id, s.name FROM UserScript us JOIN Script s ON us.scriptId = s.id WHERE us.userId=$userId AND s.isFolder=1";
        $stmt = $this->dataBase->db->query($query);
        $folders = [];
        while ($folder = $stmt->fetch()) {
            $folder['id'] =  $folder['id'] * 1;
            $folders[] = $folder;
        }
        return $folders;
    }
    public function getBlocks($scriptId)
    {
        $query = "SELECT id, name FROM Block WHERE scriptId=?";
        $query = $this->dataBase->db->prepare($query);
        $query->execute(array($scriptId));
        $blocks = [];
        while ($block = $query->fetch()) {
            $block['id'] =  $block['id'] * 1;
            $blocks[] = $block;
        }
        return $blocks;
    }
    public function getFolder($userId, $folderId = null, $searchString = '')
    {
        $result = array();
        if ($folderId) {
            $query = $this->dataBase->db->prepare("SELECT s.id, s.name FROM UserScript us JOIN Script s ON us.scriptId = s.id WHERE us.userId=$userId AND s.id=?");
            $query->execute(array($folderId));
            $result = $query->fetch();
            if (!$result) {
                throw new Exception('Каталог не найден', 404);
            }
            $result['breadCrumbs'] = $this->getBreadCrumbs($folderId);
        }

        $result['scripts'] = $this->getFolderChildren($userId, $folderId, $searchString);

        return $result;
    }

    private function getFolderChildren($userId, $folderId = null, $searchString = '')
    {
        $query = "SELECT s.id, s.name, s.isFolder, s.parentFolderId, s.lastModifyDate, s.createDate FROM UserScript us JOIN Script s ON us.scriptId = s.id WHERE us.userId=$userId AND parentFolderId IS ? AND name LIKE '%$searchString%' ORDER BY isFolder DESC";
        if ($folderId) {
            $query = "SELECT s.id, s.name, s.isFolder, s.parentFolderId, s.lastModifyDate, s.createDate FROM UserScript us JOIN Script s ON us.scriptId = s.id WHERE us.userId=$userId AND parentFolderId = ? AND name LIKE '%$searchString%' ORDER BY isFolder DESC";
        }
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($folderId));
        $scripts = [];
        while ($script = $stmt->fetch()) {
            $script['id'] =  $script['id'] * 1;
            $script['isFolder'] =  $script['isFolder'] == '1';
            $script['parentFolderId'] = $script['parentFolderId'] ? $script['parentFolderId'] * 1 : null;
            $script['lastModifyDate'] = $script['lastModifyDate'] ? date("Y/m/d H:i:s", strtotime($script['lastModifyDate'])) : null;
            $script['createDate'] = $script['createDate'] ? date("Y/m/d H:i:s", strtotime($script['createDate'])) : null;

            $scripts[] = $script;
        }
        return $scripts;
    }

    public function read($userId, $scriptId, $block)
    {
        $query = "SELECT s.id, s.name, createDate, lastModifyDate, lastModifyUserId FROM UserScript us JOIN Script s ON s.id=us.scriptId WHERE us.userId=$userId AND s.id=$scriptId";
        $script = $this->dataBase->db->query($query)->fetch();
        if (!$script) {
            throw new Exception('Скрипт не найден', 404);
        }
        $script['id'] =  $script['id'] * 1;
        $script['lastModifyDate'] = $script['lastModifyDate'] ? date("Y/m/d H:i:s", strtotime($script['lastModifyDate'])) : null;
        $script['createDate'] = $script['createDate'] ? date("Y/m/d H:i:s", strtotime($script['createDate'])) : null;
        $script['blocks'] = $this->readBlocks($scriptId, $userId, $block);
        $script['breadCrumbs'] = $this->getBreadCrumbs($script['id']);
        return $script;
    }

    public function getBreadCrumbs($scriptId, $result = array())
    {
        $query = "SELECT id, name, parentFolderId FROM $this->table WHERE id='$scriptId'";
        $script = $this->dataBase->db->query($query)->fetch();
        $script['id'] =  $script['id'] * 1;
        array_unshift($result, $script);
        if (!$script['parentFolderId']) {
            return $result;
        }

        return $this->getBreadCrumbs($script['parentFolderId'], $result);
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

    private function readBlocks($scriptId, $userId, Block $blockModel)
    {
        $query = "SELECT b.id, b.name, b.description, b.createDate, b.lastModifyDate, b.createDate, b.lastModifyUserId, b.blockIndex, (SELECT count(*) FROM UserScriptFavorite usf JOIN UserScript us ON us.id=usf.userScriptId WHERE us.userId=? AND usf.blockId=b.id) as isFavorite FROM Block b WHERE b.scriptId=? ORDER BY b.blockIndex";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($userId, $scriptId));
        $blocks = [];
        while ($block = $stmt->fetch()) {
            $block['isFavorite'] = $block['isFavorite'] == '1';
            $block['blockIndex'] = $block['blockIndex'] * 1;
            $block['id'] = $block['id'] * 1;
            $block['incommingTransitions'] = $blockModel->getTransitions($block['id']);
            $block['outgoingTransitions'] = $blockModel->getTransitions($block['id'], false);
            $blocks[] = $block;
        }
        return $blocks;
    }

    public function sortBlocks($blocks)
    {
        foreach ($blocks as $block) {
            $query = "update Block set blockIndex=? where id=?";
            $stmt = $this->dataBase->db->prepare($query);
            $stmt->execute(array($block['index'], $block['id']));
        }
        return true;
    }
}
