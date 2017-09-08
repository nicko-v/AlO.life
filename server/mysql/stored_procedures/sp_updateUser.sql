DELIMITER ;;
CREATE DEFINER=`alo_life`@`localhost` PROCEDURE `sp_updateUser`(
	IN id INT(11),
	IN nickname varchar(20),
	IN email VARCHAR(50),
	IN sex tinyint(1),
	IN avatar varchar(200)
)
BEGIN

        PREPARE statement1 FROM 'UPDATE users SET nickname = ?, email = ?, sex = ?, avatar = ? WHERE id = ? LIMIT 1';
        SET @a = nickname;
        SET @b = email;
        SET @c = sex;
        SET @d = avatar;
        SET @e = id;
        EXECUTE statement1 USING @a, @b, @c, @d, @e;
        DEALLOCATE PREPARE statement1;

END ;;
DELIMITER ;