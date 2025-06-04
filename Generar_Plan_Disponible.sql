DELIMITER //

CREATE PROCEDURE `Generar_Plan_Disponible`(
    IN p_Id_Usuario INT
)
BEGIN
    DECLARE v_dia INT DEFAULT 1;
    DECLARE v_momento VARCHAR(10);
    DECLARE v_receta INT;
    DECLARE done INT DEFAULT 0;

    -- Cursores
    DECLARE cur_disponibles CURSOR FOR
        SELECT r.Id_Receta, r.Id_Tipo_Consumo
        FROM (
            SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo, MIN(s.Fecha_Caducidad) AS Fecha_Cad
            FROM vw_Receta_Detalle_Disponible rd
            JOIN vw_stock_detalle s ON rd.Id_Alimento = s.Id_Alimento
            WHERE rd.Id_Usuario = p_Id_Usuario
              AND rd.Puede_Comer = 1
              AND s.Id_Usuario = p_Id_Usuario
              AND s.Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
            GROUP BY rd.Id_Receta, rd.Id_Tipo_Consumo
        ) r
        ORDER BY r.Fecha_Cad;

    DECLARE cur_restantes CURSOR FOR
        SELECT DISTINCT rd.Id_Receta, rd.Id_Tipo_Consumo
        FROM vw_Receta_Detalle_Disponible rd
        WHERE rd.Id_Usuario = p_Id_Usuario
          AND rd.Puede_Comer = 1
          AND rd.Id_Receta NOT IN (
              SELECT Id_Receta
              FROM (
                  SELECT DISTINCT rd.Id_Receta
                  FROM vw_Receta_Detalle_Disponible rd
                  JOIN vw_stock_detalle s ON rd.Id_Alimento = s.Id_Alimento
                  WHERE rd.Id_Usuario = p_Id_Usuario
                    AND rd.Puede_Comer = 1
                    AND s.Id_Usuario = p_Id_Usuario
                    AND s.Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
              ) x
          );

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Tabla temporal para el plan
    CREATE TEMPORARY TABLE IF NOT EXISTS Plan_Semanal (
        Dia INT,
        Momento VARCHAR(10),
        Id_Receta INT
    );

    -- Variables internas
    CREATE TEMPORARY TABLE Temp_Disponibles (
        Id_Receta INT,
        Id_Tipo_Consumo INT
    );

    CREATE TEMPORARY TABLE Temp_Restantes (
        Id_Receta INT,
        Id_Tipo_Consumo INT
    );

    -- Cargar recetas en temporales
    OPEN cur_disponibles;
    read_disponibles: LOOP
        FETCH cur_disponibles INTO v_receta, v_momento;
        IF done THEN 
            LEAVE read_disponibles;
        END IF;
        INSERT INTO Temp_Disponibles VALUES (v_receta, v_momento);
    END LOOP;
    CLOSE cur_disponibles;

    SET done = 0;

    OPEN cur_restantes;
    read_restantes: LOOP
        FETCH cur_restantes INTO v_receta, v_momento;
        IF done THEN 
            LEAVE read_restantes;
        END IF;
        INSERT INTO Temp_Restantes VALUES (v_receta, v_momento);
    END LOOP;
    CLOSE cur_restantes;

    -- Reset para recorrer días
    WHILE v_dia <= 7 DO
        -- DESAYUNO
        SET v_momento = 'Desayuno';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 1
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 1
            LIMIT 1;
            
			IF ROW_COUNT() = 0 THEN
				-- Ninguna receta disponible ni restante
				INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
				VALUES (v_dia, v_momento, NULL);
			END IF;
        END IF;

        -- COMIDA
        SET v_momento = 'Comida';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 2
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 2
            LIMIT 1;
            
			IF ROW_COUNT() = 0 THEN
				-- Ninguna receta disponible ni restante
				INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
				VALUES (v_dia, v_momento, NULL);
			END IF;
        END IF;

        -- CENA
        SET v_momento = 'Cena';
        INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
        SELECT v_dia, v_momento, Id_Receta
        FROM Temp_Disponibles
        WHERE Id_Tipo_Consumo = 3
        LIMIT 1;

        IF ROW_COUNT() = 0 THEN
            INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
            SELECT v_dia, v_momento, Id_Receta
            FROM Temp_Restantes
            WHERE Id_Tipo_Consumo = 3
            LIMIT 1;
			IF ROW_COUNT() = 0 THEN
				-- Ninguna receta disponible ni restante
				INSERT INTO Plan_Semanal (Dia, Momento, Id_Receta)
				VALUES (v_dia, v_momento, NULL);
			END IF;
        END IF;

        -- Eliminar recetas ya usadas
        DELETE FROM Temp_Disponibles
        WHERE Id_Receta IN (
            SELECT Id_Receta FROM Plan_Semanal WHERE Dia = v_dia
        );

        DELETE FROM Temp_Restantes
        WHERE Id_Receta IN (
            SELECT Id_Receta FROM Plan_Semanal WHERE Dia = v_dia
        );

        SET v_dia = v_dia + 1;
    END WHILE;

    -- Resultado final
    SELECT * FROM Plan_Semanal;

    -- Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Restantes;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END//
DELIMITER ;
