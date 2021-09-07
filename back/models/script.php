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
    public function getFolders()
    {
        $query = "SELECT id, name FROM $this->table WHERE isFolder=1";
        $stmt = $this->dataBase->db->query($query);
        $folders = [];
        while ($folder = $stmt->fetch()) {
            $folder['id'] =  $folder['id'] * 1;
            $folders[] = $folder;
        }
        return $folders;
    }
    public function getFolder($folderId = null, $searchString = '')
    {
        $result = array();
        if ($folderId) {
            $query = $this->dataBase->db->prepare("SELECT id, name, parentFolderId FROM $this->table WHERE id=?");
            $query->execute(array($folderId));
            $result = $query->fetch();
            $result['breadCrumbs'] = $this->getBreadCrumbs($folderId);
        }

        $result['scripts'] = $this->getFolderChildren($folderId, $searchString);

        return $result;
    }

    public function getFolderChildren($folderId = null, $searchString = '')
    {
        $query = "SELECT * FROM $this->table WHERE parentFolderId IS ? AND name LIKE '%$searchString%' ORDER BY isFolder DESC";
        if ($folderId) {
            $query = "SELECT * FROM $this->table WHERE parentFolderId = ? AND name LIKE '%$searchString%' ORDER BY isFolder DESC";
        }
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($folderId));
        $scripts = [];
        while ($script = $stmt->fetch()) {
            $script['id'] =  $script['id'] * 1;
            $script['isFolder'] =  $script['isFolder'] == '1';
            $script['parentFolderId'] = $script['parentFolderId'] ? $script['parentFolderId'] * 1 : null;
            $script['lastModifyDate'] = $script['lastModifyDate'] ? date("Y/m/d H:00:00", strtotime($script['lastModifyDate'])) : null;
            $script['createDate'] = $script['createDate'] ? date("Y/m/d H:00:00", strtotime($script['createDate'])) : null;

            $scripts[] = $script;
        }
        return $scripts;
    }

    public function read($userScriptId, $block)
    {
        $query = "SELECT s.id, s.name, createDate, lastModifyDate, lastModifyUserId FROM $this->table s JOIN UserScript us ON s.id=us.scriptId WHERE us.id='$userScriptId'";
        $script = $this->dataBase->db->query($query)->fetch();
        $script['id'] =  $script['id'] * 1;
        $script['lastModifyDate'] = $script['lastModifyDate'] ? date("Y/m/d H:00:00", strtotime($script['lastModifyDate'])) : null;
        $script['createDate'] = $script['createDate'] ? date("Y/m/d H:00:00", strtotime($script['createDate'])) : null;
        $script['blocks'] = $this->readBlocks($userScriptId, $script['id'], $block);
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

    public function readBlocks($scriptId, $userScriptId, Block $blockModel)
    {
        $query = "SELECT b.id, b.name, b.description, b.createDate, b.lastModifyDate, b.createDate, b.lastModifyUserId, b.blockIndex, (SELECT count(*) FROM UserScriptFavorite usf WHERE usf.userScriptId=? AND usf.blockId=b.id) as isFavorite FROM Block b WHERE b.scriptId=? ORDER BY b.blockIndex";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($userScriptId, $scriptId));
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
