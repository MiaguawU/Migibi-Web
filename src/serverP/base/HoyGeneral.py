from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import mysql.connector
from .connection import get_db_connection
from .FechaActual import obtener_fecha_actual

hoy_general_bp = APIRouter()

# Modelo para validar la entrada de datos
class RecetaDiaCreate(BaseModel):
    id_usuario_alta: int

# Crear un nuevo registro de recetas del día
@hoy_general_bp.post("/{id}")
def crear_receta_dia(id: int, receta: RecetaDiaCreate):
    query = """
        INSERT INTO recetas_dia (Fecha, Activo, Id_Usuario_Alta, Fecha_Alta)
        VALUES (NOW(), 1, %s, NOW())
    """

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, (id,))
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Receta del día creada con éxito"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail={"message": "Error interno del servidor", "error": str(err)})
    finally:
        cursor.close()
        conn.close()

# Obtener receta(s) (GET)
@hoy_general_bp.get("/{id}")
def obtener_receta_dia(id: int):
    query = f"""
        SELECT 
            rd.Id_Recetas_Dia,
            rd.Id_Usuario_Alta,
            rd.Fecha,
            d.Id_Receta AS Id_Receta_Desayuno, 
            d.Nombre AS Nombre_Desayuno, 
            d.Porciones AS Porciones_Desayuno,
            d.Calorias AS Calorias_Desayuno,
            d.Tiempo AS Tiempo_Desayuno,
            d.Imagen_receta AS Imagen_Desayuno,
            d.Activo AS Activo_Desayuno,
            c.Id_Receta AS Id_Receta_Comida, 
            c.Nombre AS Nombre_Comida,  
            c.Porciones AS Porciones_Comida,
            c.Calorias AS Calorias_Comida,
            c.Tiempo AS Tiempo_Comida,
            c.Imagen_receta AS Imagen_Comida,
            c.Activo AS Activo_Comida,
            ce.Id_Receta AS Id_Receta_Cena, 
            ce.Nombre AS Nombre_Cena,  
            ce.Porciones AS Porciones_Cena,
            ce.Calorias AS Calorias_Cena,
            ce.Tiempo AS Tiempo_Cena,
            ce.Imagen_receta AS Imagen_Cena,
            ce.Activo AS Activo_Cena
        FROM 
            recetas_dia rd
        LEFT JOIN receta d ON rd.Id_Receta_Desayuno = d.Id_Receta
        LEFT JOIN receta c ON rd.Id_Receta_Comida = c.Id_Receta
        LEFT JOIN receta ce ON rd.Id_Receta_Cena = ce.Id_Receta
        WHERE
            rd.Id_Usuario_Alta = %s AND {obtener_fecha_actual()}
    """

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(query, (id,))
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail={"message": "Error al obtener plan", "error": str(err)})
    finally:
        cursor.close()
        conn.close()
