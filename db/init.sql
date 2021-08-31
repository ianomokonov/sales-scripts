-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'User'
-- 
-- ---

DROP TABLE IF EXISTS `User`;
		
CREATE TABLE `User` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(200) NOT NULL DEFAULT 'NULL',
  `password` VARCHAR(200) NOT NULL DEFAULT 'NULL',
  `email` VARCHAR(200) NOT NULL DEFAULT 'NULL',
  `phone` VARCHAR(20) NOT NULL DEFAULT 'NULL',
  -- `name` VARCHAR(200) NOT NULL DEFAULT 'NULL',
  -- `surname` VARCHAR(200) NULL DEFAULT NULL,
  -- `lastname` VARCHAR(200) NULL DEFAULT NULL,
  `isAdmin` bit NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);


-- ---
-- Table 'RefreshTokens'
-- 
-- ---

DROP TABLE IF EXISTS `RefreshTokens`;
		
CREATE TABLE `RefreshTokens` (
  `id` INTEGER(10) AUTO_INCREMENT,
  `userId` INTEGER(10) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
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
  `lastModifyDate` DATETIME NULL,
  `lastModifyUserId` INTEGER NULL,
  `index` INTEGER NOT NULL,
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
  `lastModifyUserId` INTEGER NULL,
  `blockIndex` INTEGER NOT NULL,
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

ALTER TABLE `RefreshTokens` ADD FOREIGN KEY (userId) REFERENCES `User` (`id`);
ALTER TABLE `Script` ADD FOREIGN KEY (parentFolderId) REFERENCES `Script` (`id`);
ALTER TABLE `Script` ADD FOREIGN KEY (lastModifyUserId) REFERENCES `User` (`id`) ON DELETE SET NULL;
ALTER TABLE `Block` ADD FOREIGN KEY (scriptId) REFERENCES `Script` (`id`);
ALTER TABLE `Block` ADD FOREIGN KEY (lastModifyUserId) REFERENCES `User` (`id`) ON DELETE SET NULL;
ALTER TABLE `UserScript` ADD FOREIGN KEY (scriptId) REFERENCES `Script` (`id`) ON DELETE CASCADE;
ALTER TABLE `UserScript` ADD FOREIGN KEY (userId) REFERENCES `User` (`id`) ON DELETE CASCADE;
ALTER TABLE `UserScriptFavorite` ADD FOREIGN KEY (userScriptId) REFERENCES `UserScript` (`id`) ON DELETE CASCADE;
ALTER TABLE `UserScriptFavorite` ADD FOREIGN KEY (blockId) REFERENCES `Block` (`id`) ON DELETE CASCADE;
ALTER TABLE `BlockAnswer` ADD FOREIGN KEY (blockId) REFERENCES `Block` (`id`) ON DELETE CASCADE;
ALTER TABLE `BlockAnswer` ADD FOREIGN KEY (nextBlockId) REFERENCES `Block` (`id`) ON DELETE CASCADE;
ALTER TABLE `ScriptParam` ADD FOREIGN KEY (scriptId) REFERENCES `Script` (`id`) ON DELETE CASCADE;
ALTER TABLE `UserScriptParamValue` ADD FOREIGN KEY (userScriptId) REFERENCES `UserScript` (`id`) ON DELETE CASCADE;
ALTER TABLE `UserScriptParamValue` ADD FOREIGN KEY (paramId) REFERENCES `ScriptParam` (`id`) ON DELETE CASCADE;

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

--
-- Дамп данных таблицы `User`
--

INSERT INTO `User` (`id`, `login`, `password`, `email`, `phone`, `isAdmin`) VALUES
(1, 'inomokonov', '111', 'nomokonov.vana@gmail.com', 'NULL', b'0');

--
-- Дамп данных таблицы `Script`
--

INSERT INTO `Script` (`id`, `name`, `isFolder`, `parentFolderId`, `createDate`, `lastModifyDate`, `lastModifyUserId`) VALUES
(1, 'Скрипт 1', b'0', NULL, '2021-08-31 12:41:31', NULL, 1);


--
-- Дамп данных таблицы `Block`
--

INSERT INTO `Block` (`id`, `name`, `description`, `scriptId`, `createDate`, `lastModifyDate`, `lastModifyUserId`, `blockIndex`) VALUES
(1, 'Блок номер 1 для знакомства', 'Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании новых предложений.\r\nЗначимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Разнообразный и богатый опыт консультация с широким активом обеспечивает широкому кругу.\r\nТоварищи! сложившаяся структура организации представляет собой интересный эксперимент проверки направлений прогрессивного развития. Значимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений.', 1, '2021-08-31 12:50:42', NULL, 1, 0),
(2, 'Блок номер 2 для знакомства', 'Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании новых предложений.\r\nЗначимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Разнообразный и богатый опыт консультация с широким активом обеспечивает широкому кругу.\r\nТоварищи! сложившаяся структура организации представляет собой интересный эксперимент проверки направлений прогрессивного развития. Значимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений.', 1, '2021-08-31 12:50:51', NULL, 1, 1),
(3, 'Блок номер 3 для знакомства', 'Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании новых предложений.\r\nЗначимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Разнообразный и богатый опыт консультация с широким активом обеспечивает широкому кругу.\r\nТоварищи! сложившаяся структура организации представляет собой интересный эксперимент проверки направлений прогрессивного развития. Значимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений.', 1, '2021-08-31 12:51:22', NULL, 1, 2),
(4, 'Блок номер 4 для знакомства', 'Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании новых предложений.\r\nЗначимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Разнообразный и богатый опыт консультация с широким активом обеспечивает широкому кругу.\r\nТоварищи! сложившаяся структура организации представляет собой интересный эксперимент проверки направлений прогрессивного развития. Значимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений.', 1, '2021-08-31 12:51:22', NULL, 1, 3),
(5, 'Блок номер 5 для знакомства', 'Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании новых предложений.\r\nЗначимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Разнообразный и богатый опыт консультация с широким активом обеспечивает широкому кругу.\r\nТоварищи! сложившаяся структура организации представляет собой интересный эксперимент проверки направлений прогрессивного развития. Значимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений.', 1, '2021-08-31 12:51:22', NULL, 1, 4),
(6, 'Блок номер 6 для знакомства', 'Равным образом постоянный количественный рост и сфера нашей активности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Значимость этих проблем настолько очевидна, что дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании новых предложений.\r\nЗначимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений. Равным образом консультация с широким активом требуют определения и уточнения модели развития. Разнообразный и богатый опыт консультация с широким активом обеспечивает широкому кругу.\r\nТоварищи! сложившаяся структура организации представляет собой интересный эксперимент проверки направлений прогрессивного развития. Значимость этих проблем настолько очевидна, что консультация с широким активом играет важную роль в формировании новых предложений.', 1, '2021-08-31 12:51:22', NULL, 1, 5);


-- UserScript

INSERT INTO `UserScript` (`id`, `scriptId`, `userId`) VALUES (1, '1', '1');


-- UserScriptFavorite

INSERT INTO `UserScriptFavorite` (`id`, `userScriptId`, `blockId`) VALUES (1, '1', '1'), (2, '1', '4');