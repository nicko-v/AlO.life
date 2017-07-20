DELIMITER ;;
CREATE DEFINER=`alo_life`@`localhost` PROCEDURE `sp_addUrlWithUserAlias`(IN url VARCHAR(1000), IN alias VARCHAR(50))
BEGIN

        PREPARE statement1 FROM 'INSERT INTO shortened_urls (url, alias, created) VALUES (?, ?, NOW())';
        SET @a = url;
        SET @b = alias;
        EXECUTE statement1 USING @a, @b;
        DEALLOCATE PREPARE statement1;

END ;;
DELIMITER ;