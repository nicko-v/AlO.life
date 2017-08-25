CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` tinyint(1) DEFAULT NULL,
  `bdate` date DEFAULT NULL,
  `country` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reg_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci