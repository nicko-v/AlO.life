DELIMITER ;;
CREATE DEFINER=`alo_life`@`localhost` PROCEDURE `sp_getUrl`(IN alias VARCHAR(50))
BEGIN

        PREPARE statement1 FROM 'SELECT url FROM shortened_urls WHERE alias = ? LIMIT 1';
        SET @a = alias;
        EXECUTE statement1 USING @a;
        DEALLOCATE PREPARE statement1;

        PREPARE statement2 FROM 'UPDATE shortened_urls SET asked = asked + 1, lastAsked = NOW() WHERE alias = ?';
        SET @a = alias;
        EXECUTE statement2 USING @a;
        DEALLOCATE PREPARE statement2;

END ;;
DELIMITER ;