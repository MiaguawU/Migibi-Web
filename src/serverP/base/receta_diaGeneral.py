from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector
from datetime import datetime
from .connection import get_db_connection

# Crear el router con prefijo y etiquetas
recetas_dia_general_router = APIRouter()

# Modelos de validación con Pydantic
class ExistePlanSchema(BaseModel):
    Id_Usuario_Alta: int
    Fecha: str

# Crear un nuevo registro de recetas del día
@recetas_dia_general_router.post("/{Id_Usuario_Alta}")
def crear_receta(Id_Usuario_Alta: int, data: ExistePlanSchema):
    try:
        fecha_obj = datetime.strptime(data.Fecha, "%Y-%m-%d")
        FechaR = fecha_obj.strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise HTTPException(status_code=400, detail={"error": "Formato de fecha inválido"})

    query = """
        INSERT INTO recetas_dia (Fecha, Activo, Id_Usuario_Alta, Fecha_Alta) 
        VALUES (%s, 1, %s, NOW());
    """
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, (FechaR, Id_Usuario_Alta))
        conn.commit()
        receta_id = cursor.lastrowid
        return {"id": receta_id, "message": "Receta del día creada con éxito"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail={"message": "Error interno del servidor", "error": str(err)})
    finally:
        cursor.close()
        conn.close()

# Obtener recetas de la semana actual
@recetas_dia_general_router.get("/")
def obtener_recetas():
    query = """
        SELECT 
            rd.Id_Recetas_Dia, rd.Fecha,
            d.Id_Receta AS Id_Receta_Desayuno, d.Nombre AS Nombre_Desayuno, 
            d.Porciones AS Porciones_Desayuno, d.Calorias AS Calorias_Desayuno,
            d.Tiempo AS Tiempo_Desayuno, d.Imagen_receta AS Imagen_Desayuno, d.Activo AS Activo_Desayuno,
            c.Id_Receta AS Id_Receta_Comida, c.Nombre AS Nombre_Comida,  
            c.Porciones AS Porciones_Comida, c.Calorias AS Calorias_Comida,
            c.Tiempo AS Tiempo_Comida, c.Imagen_receta AS Imagen_Comida, c.Activo AS Activo_Comida,
            ce.Id_Receta AS Id_Receta_Cena, ce.Nombre AS Nombre_Cena,  
            ce.Porciones AS Porciones_Cena, ce.Calorias AS Calorias_Cena,
            ce.Tiempo AS Tiempo_Cena, ce.Imagen_receta AS Imagen_Cena, ce.Activo AS Activo_Cena
        FROM recetas_dia rd
        LEFT JOIN receta d ON rd.Id_Receta_Desayuno = d.Id_Receta
        LEFT JOIN receta c ON rd.Id_Receta_Comida = c.Id_Receta
        LEFT JOIN receta ce ON rd.Id_Receta_Cena = ce.Id_Receta
        WHERE WEEK(rd.Fecha) = WEEK(CURDATE()) AND YEAR(rd.Fecha) = YEAR(CURDATE());
    """

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail={"message": "Error al obtener plan", "error": str(err)})
    finally:
        cursor.close()
        conn.close()

# Obtener recetas para un usuario y fecha específicos
@recetas_dia_general_router.post("/agregarPlan/{Id_Usuario_Alta}")
def agregar_plan(Id_Usuario_Alta: int, data: ExistePlanSchema):
    try:
        fecha_obj = datetime.strptime(data.Fecha, "%Y-%m-%d")
        FechaR = fecha_obj.strftime("%Y-%m-%d %H:%M:%S")
    except ValueError:
        raise HTTPException(status_code=400, detail={"error": "Formato de fecha inválido"})

    query = """
        SELECT * FROM recetas_dia 
        WHERE Id_Usuario_Alta = %s AND Fecha = %s;
    """

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, (Id_Usuario_Alta, FechaR))
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail={"message": "Error al obtener plan", "error": str(err)})
    finally:
        cursor.close()
        conn.close()
