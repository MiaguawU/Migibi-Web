DELIMITER //
CREATE PROCEDURE `Generar_Plan_Estricto`(
    IN p_Id_Usuario INT
)
BEGIN
    -- 1. Declaraciones
    DECLARE v_dia INT DEFAULT 1;
    DECLARE v_receta INT;
    DECLARE done INT DEFAULT 0;

    -- Cursores para desayuno, comida y cena
    DECLARE cur_desayuno CURSOR FOR
        SELECT Id_Receta FROM Temp_Recetas_Estrictas
        WHERE Id_Tipo_Consumo = 1
        ORDER BY Fecha_Mas_Cercana;

    DECLARE cur_comida CURSOR FOR
        SELECT Id_Receta FROM Temp_Recetas_Estrictas
        WHERE Id_Tipo_Consumo = 2
        ORDER BY Fecha_Mas_Cercana;

    DECLARE cur_cena CURSOR FOR
        SELECT Id_Receta FROM Temp_Recetas_Estrictas
        WHERE Id_Tipo_Consumo = 3
        ORDER BY Fecha_Mas_Cercana;

    -- Handler único para fin de cursores
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- 2. Crear tablas temporales necesarias
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento, Fecha_Caducidad
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300)
      AND Id_Usuario = p_Id_Usuario;

    CREATE TEMPORARY TABLE Temp_Ingredientes_Usuario AS
    SELECT Id_Receta, Id_Alimento, Id_Tipo_Consumo
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario
      AND Puede_Comer = 1;

    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Totales AS
    SELECT Id_Receta, COUNT(*) AS Total_Ingredientes
    FROM vw_receta_detalle
    GROUP BY Id_Receta;

    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Disponibles AS
    SELECT i.Id_Receta, COUNT(*) AS Ingredientes_Disponibles
    FROM Temp_Ingredientes_Usuario i
    INNER JOIN Temp_Stock_Detalle s ON i.Id_Alimento = s.Id_Alimento
    GROUP BY i.Id_Receta;

    CREATE TEMPORARY TABLE Temp_Recetas_Estrictas AS
    SELECT t.Id_Receta, u.Id_Tipo_Consumo, MIN(s.Fecha_Caducidad) AS Fecha_Mas_Cercana
    FROM Temp_Receta_Ingredientes_Totales t
    JOIN Temp_Receta_Ingredientes_Disponibles d ON t.Id_Receta = d.Id_Receta
    JOIN Temp_Ingredientes_Usuario u ON t.Id_Receta = u.Id_Receta
    JOIN Temp_Stock_Detalle s ON u.Id_Alimento = s.Id_Alimento
    WHERE t.Total_Ingredientes = d.Ingredientes_Disponibles
    GROUP BY t.Id_Receta, u.Id_Tipo_Consumo;

    CREATE TEMPORARY TABLE Plan_Semanal (
        Dia INT,
        Momento VARCHAR(10),
        Id_Receta INT
    );

    -- 3. Generar plan semanal
    OPEN cur_desayuno;
    OPEN cur_comida;
    OPEN cur_cena;

    WHILE v_dia <= 7 DO
        -- DESAYUNO
        SET done = 0;
        FETCH cur_desayuno INTO v_receta;
        IF done = 1 THEN
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Desayuno', NULL);
        ELSE
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Desayuno', v_receta);
        END IF;

        -- COMIDA
        SET done = 0;
        FETCH cur_comida INTO v_receta;
        IF done = 1 THEN
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Comida', NULL);
        ELSE
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Comida', v_receta);
        END IF;

        -- CENA
        SET done = 0;
        FETCH cur_cena INTO v_receta;
        IF done = 1 THEN
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Cena', NULL);
        ELSE
            INSERT INTO Plan_Semanal VALUES (v_dia, 'Cena', v_receta);
        END IF;

        SET v_dia = v_dia + 1;
    END WHILE;

    CLOSE cur_desayuno;
    CLOSE cur_comida;
    CLOSE cur_cena;

    -- 4. Mostrar resultado
    SELECT * FROM Plan_Semanal;

    -- 5. Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Ingredientes_Usuario;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Totales;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Estrictas;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END//
DELIMITER ;
