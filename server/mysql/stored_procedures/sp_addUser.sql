DELIMITER ;;
CREATE DEFINER=`alo_life`@`localhost` PROCEDURE `sp_addUser`(
	IN id INT(11),
	IN nickname varchar(20),
	IN email VARCHAR(50),
	IN sex tinyint(1),
	IN avatar varchar(200)
)
BEGIN

        PREPARE statement1 FROM 'INSERT INTO users (id, nickname, email, sex, avatar, reg_date) VALUES (?, ?, ?, ?, ?, NOW())';
        SET @a = id;
        SET @b = nickname;
        SET @c = email;
        SET @d = sex;
        SET @e = avatar;
        EXECUTE statement1 USING @a, @b, @c, @d, @e;
        DEALLOCATE PREPARE statement1;

END ;;
DELIMITER ;