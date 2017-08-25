DELIMITER ;;
CREATE DEFINER=`alo_life`@`localhost` PROCEDURE `sp_addUser`(
	IN id INT(11),
	IN email VARCHAR(50),
	IN first_name varchar(20),
	IN last_name varchar(20),
	IN sex tinyint(1),
	IN bdate date,
	IN country varchar(50),
	IN city varchar(30),
	IN photo varchar(200)
)
BEGIN

        PREPARE statement1 FROM 'INSERT INTO users (id, email, first_name, last_name, sex, bdate, country, city, photo, reg_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())';
        SET @a = id;
        SET @b = email;
        SET @c = first_name;
        SET @d = last_name;
        SET @e = sex;
				SET @f = bdate;
        SET @g = country;
        SET @h = city;
        SET @i = photo;
        EXECUTE statement1 USING @a, @b, @c, @d, @e, @f, @g, @h, @i;
        DEALLOCATE PREPARE statement1;

END ;;
DELIMITER ;