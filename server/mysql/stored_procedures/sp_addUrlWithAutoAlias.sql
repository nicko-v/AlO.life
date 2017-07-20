DELIMITER ;;
CREATE DEFINER=`alo_life`@`localhost` PROCEDURE `sp_addUrlWithAutoAlias`(IN url VARCHAR(1000))
BEGIN

        DECLARE dup TINYINT;
        DECLARE aliasDec INT;
        DECLARE aliasB36 VARCHAR(10);

        SELECT IFNULL(MAX(CONV(UPPER(alias), 36, 10)) + 1, 1296) INTO aliasDec FROM shortened_urls WHERE isGenerated = 1;
        SELECT EXISTS(SELECT alias FROM shortened_urls WHERE alias = LOWER(CONV(aliasDec, 10, 36))) INTO dup;

        WHILE dup = 1 DO
                SET aliasDec = aliasDec + 1;
                SELECT EXISTS(SELECT alias FROM shortened_urls WHERE alias = LOWER(CONV(aliasDec, 10, 36))) INTO dup;
        END WHILE;

        SET aliasB36 = CONV(aliasDec, 10, 36);

        PREPARE statement1 FROM 'INSERT INTO shortened_urls (url, alias, created, isGenerated) VALUES (?, ?, NOW(), 1)';
        SET @a = url;
        SET @b = aliasB36;
        EXECUTE statement1 USING @a, @b;
        DEALLOCATE PREPARE statement1;

        SELECT aliasB36;

END ;;
DELIMITER ;