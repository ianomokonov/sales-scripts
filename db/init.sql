-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'User'
-- 
-- ---

DROP TABLE IF EXISTS `User`;
		
CREATE TABLE `User` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL DEFAULT 'NULL',
  `surname` VARCHAR(200) NULL DEFAULT NULL,
  `lastname` VARCHAR(200) NULL DEFAULT NULL,
  `isAdmin` bit NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Script'
-- 
-- ---

DROP TABLE IF EXISTS `Script`;
		
CREATE TABLE `Script` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `isFolder` bit(1) NOT NULL DEFAULT 0,
  `parentFolderId` INTEGER NULL DEFAULT NULL,
  `createDate` DATETIME NOT NULL DEFAULT now(),
  `lastModifyDate` DATETIME NULL DEFAULT NULL,
  `lastModifyUserId` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'Block'
-- 
-- ---

DROP TABLE IF EXISTS `Block`;
		
CREATE TABLE `Block` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `description` MEDIUMTEXT NOT NULL,
  `scriptId` INTEGER NOT NULL,
  `createDate` DATETIME NOT NULL DEFAULT now(),
  `lastModifyDate` DATETIME NULL DEFAULT NULL,
  `lastModifyUserId` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'UserScript'
-- 
-- ---

DROP TABLE IF EXISTS `UserScript`;
		
CREATE TABLE `UserScript` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `scriptId` INTEGER NOT NULL,
  `userId` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'UserScriptFavorite'
-- 
-- ---

DROP TABLE IF EXISTS `UserScriptFavorite`;
		
CREATE TABLE `UserScriptFavorite` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userScriptId` INTEGER NOT NULL,
  `blockId` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'BlockAnswer'
-- 
-- ---

DROP TABLE IF EXISTS `BlockAnswer`;
		
CREATE TABLE `BlockAnswer` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `blockId` INTEGER NOT NULL,
  `nextBlockId` INTEGER NULL,
  `answer` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'ScriptParam'
-- 
-- ---

DROP TABLE IF EXISTS `ScriptParam`;
		
CREATE TABLE `ScriptParam` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `uniquePlaceholder` VARCHAR(200) NOT NULL,
  `scriptId` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'UserScriptParamValue'
-- 
-- ---

DROP TABLE IF EXISTS `UserScriptParamValue`;
		
CREATE TABLE `UserScriptParamValue` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `userScriptId` INTEGER NOT NULL,
  `paramId` INTEGER NOT NULL,
  `value` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `Script` ADD FOREIGN KEY (parentFolderId) REFERENCES `Script` (`id`);
ALTER TABLE `Script` ADD FOREIGN KEY (lastModifyUserId) REFERENCES `User` (`id`);
ALTER TABLE `Block` ADD FOREIGN KEY (scriptId) REFERENCES `Script` (`id`);
ALTER TABLE `Block` ADD FOREIGN KEY (lastModifyUserId) REFERENCES `User` (`id`);
ALTER TABLE `UserScript` ADD FOREIGN KEY (scriptId) REFERENCES `Script` (`id`);
ALTER TABLE `UserScript` ADD FOREIGN KEY (userId) REFERENCES `User` (`id`);
ALTER TABLE `UserScriptFavorite` ADD FOREIGN KEY (userScriptId) REFERENCES `UserScript` (`id`);
ALTER TABLE `UserScriptFavorite` ADD FOREIGN KEY (blockId) REFERENCES `Block` (`id`);
ALTER TABLE `BlockAnswer` ADD FOREIGN KEY (blockId) REFERENCES `Block` (`id`);
ALTER TABLE `BlockAnswer` ADD FOREIGN KEY (nextBlockId) REFERENCES `Block` (`id`);
ALTER TABLE `ScriptParam` ADD FOREIGN KEY (scriptId) REFERENCES `Script` (`id`);
ALTER TABLE `UserScriptParamValue` ADD FOREIGN KEY (userScriptId) REFERENCES `UserScript` (`id`);
ALTER TABLE `UserScriptParamValue` ADD FOREIGN KEY (paramId) REFERENCES `ScriptParam` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `User` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Script` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `Block` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `UserScript` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `UserScriptFavorite` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `BlockAnswer` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `ScriptParam` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `UserScriptParamValue` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `User` (`id`,`name`,`surname`,`lastname `,`isAdmin`) VALUES
-- ('','','','','');
-- INSERT INTO `Script` (`id`,`name`,`isFolder`,`parentFolderId`,`createDate`,`lastModifyDate`,`lastModifyUserId`) VALUES
-- ('','','','','','','');
-- INSERT INTO `Block` (`id`,`name`,`description `,`scriptId`,`createDate`,`lastModifyDate`,`lastModifyUserId`) VALUES
-- ('','','','','','','');
-- INSERT INTO `UserScript` (`id`,`scriptId`,`userId`) VALUES
-- ('','','');
-- INSERT INTO `UserScriptFavorite` (`id`,`userScriptId`,`blockId`) VALUES
-- ('','','');
-- INSERT INTO `BlockAnswer` (`id`,`blockId`,`nextBlockId`,`answer`) VALUES
-- ('','','','');
-- INSERT INTO `ScriptParam` (`id`,`name`,`uniquePlaceholder`,`scriptId`) VALUES
-- ('','','','');
-- INSERT INTO `UserScriptParamValue` (`id`,`userScriptId`,`paramId`,`value`) VALUES
-- ('','','','');