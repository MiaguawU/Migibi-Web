
DELIMITER //
CREATE PROCEDURE `Generar_Plan_Estricto_Hoy`(
    IN p_Id_Usuario INT
)
BEGIN

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
	
    -- 5. Limpieza
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Ingredientes_Usuario;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Totales;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Disponibles;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Estrictas;
    DROP TEMPORARY TABLE IF EXISTS Plan_Semanal;
END //
DELIMITER ;