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
    public function getFolder($folderId = null)
    {
        $result = array();
        if ($folderId) {
            $query = $this->dataBase->db->prepare("SELECT id, name, parentFolderId FROM $this->table WHERE id=?");
            $query->execute(array($folderId));
            $result = $query->fetch();
        }

        $result['scripts'] = $this->getFolderChildren($folderId);

        return $result;
    }

    public function getFolderChildren($folderId = null)
    {
        $query = "SELECT * FROM $this->table WHERE parentFolderId IS ? ORDER BY isFolder DESC";
        if ($folderId) {
            $query = "SELECT * FROM $this->table WHERE parentFolderId = ? ORDER BY isFolder DESC";
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

    public function read($userScriptId)
    {
        $query = "SELECT * FROM $this->table s JOIN UserScript us ON s.id=us.scriptId WHERE us.id='$userScriptId'";
        $script = $this->dataBase->db->query($query)->fetch();
        $script['blocks'] = $this->readBlocks($userScriptId, $script['id']);
        return $script;
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

    public function readBlocks($scriptId, $userScriptId)
    {
        $query = "SELECT b.id, b.name, b.description, b.createDate, b.lastModifyDate, b.createDate, b.lastModifyUserId, b.blockIndex, (SELECT count(*) FROM UserScriptFavorite usf WHERE usf.userScriptId=? AND usf.blockId=b.id) as isFavorite FROM Block b WHERE b.scriptId=? ORDER BY b.blockIndex";
        $stmt = $this->dataBase->db->prepare($query);
        $stmt->execute(array($userScriptId, $scriptId));
        $blocks = [];
        while ($block = $stmt->fetch()) {
            $block['isFavorite'] = $block['isFavorite'] == '1';
            $block['blockIndex'] = $block['blockIndex'] * 1;
            $block['id'] = $block['id'] * 1;
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
