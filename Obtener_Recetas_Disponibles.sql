DELIMITER //

CREATE PROCEDURE Obtener_Recetas_Disponibles (
    IN p_Id_Usuario INT
)
BEGIN
    -- Crear tabla temporal para el stock filtrado
    CREATE TEMPORARY TABLE Temp_Stock_Detalle AS
    SELECT Id_Alimento 
    FROM vw_stock_detalle 
    WHERE Fecha_Caducidad < ADDDATE(DATE(NOW()), 300) 
      AND Id_Usuario = p_Id_Usuario;

    -- Crear tabla temporal para las recetas disponibles
    CREATE TEMPORARY TABLE Temp_Recetas_Disponibles AS
    SELECT DISTINCT Id_Receta 
    FROM vw_Receta_Detalle_Disponible 
    WHERE Id_Usuario = p_Id_Usuario 
      AND Puede_Comer = 1 
      AND Id_Alimento IN (SELECT Id_Alimento FROM Temp_Stock_Detalle);

    -- Obtener alimentos faltantes
    SELECT Id_Receta FROM Temp_Recetas_Disponibles;

    -- Limpiar las tablas temporales
    DROP TEMPORARY TABLE IF EXISTS Temp_Stock_Detalle;
    DROP TEMPORARY TABLE IF EXISTS Temp_Recetas_Disponibles;
END //

DELIMITER ;
