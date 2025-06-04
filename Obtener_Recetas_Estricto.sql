use migibi;

DELIMITER //
CREATE PROCEDURE `Obtener_Recetas_Estricto`(
    IN p_Id_Usuario INT
)
BEGIN
    -- Stock válido del usuario
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento 
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300) 
      AND Id_Usuario = p_Id_Usuario;

    -- Ingredientes permitidos al usuario por receta
    CREATE TEMPORARY TABLE Temp_Ingredientes_Usuario AS
    SELECT Id_Receta, Id_Alimento
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario 
      AND Puede_Comer = 1;

    -- Conteo total de ingredientes por receta
    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Totales AS
    SELECT Id_Receta, COUNT(*) AS Total_Ingredientes
    FROM vw_receta_detalle
    GROUP BY Id_Receta;

    -- Conteo de ingredientes disponibles en stock por receta
    CREATE TEMPORARY TABLE Temp_Receta_Ingredientes_Disponibles AS
    SELECT i.Id_Receta, COUNT(*) AS Ingredientes_Disponibles
    FROM Temp_Ingredientes_Usuario i
    INNER JOIN Temp_Stock_Detalle s ON i.Id_Alimento = s.Id_Alimento
    GROUP BY i.Id_Receta;

    -- Seleccionar recetas donde el total de ingredientes coincida con los disponibles
    SELECT t.Id_Receta
    FROM Temp_Receta_Ingredientes_Totales t
    INNER JOIN Temp_Receta_Ingredientes_Disponibles d ON t.Id_Receta = d.Id_Receta
    WHERE t.Total_Ingredientes = d.Ingredientes_Disponibles;

    -- Limpiar
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Ingredientes_Usuario;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Totales;
    DROP TEMPORARY TABLE IF EXISTS Temp_Receta_Ingredientes_Disponibles;
END; //
DELIMITER ;
