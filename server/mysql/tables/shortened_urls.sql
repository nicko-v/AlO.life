CREATE TABLE `shortened_urls` (
  `url` varchar(4000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alias` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `asked` mediumint(9) DEFAULT '0',
  `isGenerated` tinyint(1) DEFAULT '0',
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`alias`),
  UNIQUE KEY `url_alias_UNIQUE` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;