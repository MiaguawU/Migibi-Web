from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from .connection import get_db_connection

receta_general_bp = APIRouter()

# Modelo para eliminar receta con usuario y fecha
class BajaReceta(BaseModel):
    id_usuario_baja: int
    fecha_baja: str

# 📌 Crear una nueva receta (POST)
@receta_general_bp.post("/{id}")
def crear_receta(id: int):
    db = get_db()
    cursor = db.cursor()

    if not id:
        raise HTTPException(status_code=400, detail="ID de usuario inválido o no proporcionado")

    query = """
        INSERT INTO receta (Nombre, Id_Usuario_Alta, Fecha_Alta, Id_Tipo_Consumo, Tiempo, Calorias, Activo)
        VALUES ('Receta_nueva', %s, %s, 1, '00:30:00', 20, 0);
    """
    fecha_alta = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        cursor.execute(query, (id, fecha_alta))
        db.commit()
        return {"id": cursor.lastrowid, "message": "Receta agregada con éxito"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al agregar receta: {str(e)}")
    finally:
        cursor.close()
        db.close()

# 📌 Obtener todas las recetas (GET)
@receta_general_bp.get("/")
def obtener_recetas():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = """
        SELECT Id_Receta, Nombre, Tiempo, Calorias, Imagen_receta, Id_Usuario_Alta, Activo
        FROM receta
    """
    
    try:
        cursor.execute(query)
        recetas = cursor.fetchall()
        return recetas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener recetas: {str(e)}")
    finally:
        cursor.close()
        db.close()

# 📌 Obtener nombres de recetas (GET)
@receta_general_bp.get("/nombres")
def obtener_nombres_recetas():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    query = "SELECT Id_Receta, Nombre, Activo FROM receta"

    try:
        cursor.execute(query)
        nombres = cursor.fetchall()
        return nombres
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener nombres de recetas: {str(e)}")
    finally:
        cursor.close()
        db.close()

# 📌 Marcar una receta como inactiva (PUT)
@receta_general_bp.put("/{id}")
def eliminar_receta(id: int):
    db = get_db()
    cursor = db.cursor()

    query = "UPDATE receta SET Activo = 0 WHERE Id_Receta = %s"

    try:
        cursor.execute(query, (id,))
        db.commit()
        return {"message": "Receta eliminada con éxito"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar receta: {str(e)}")
    finally:
        cursor.close()
        db.close()

# 📌 Baja lógica de una receta con usuario y fecha (DELETE)
@receta_general_bp.delete("/{id}")
def baja_logica_receta(id: int, baja_data: BajaReceta):
    db = get_db()
    cursor = db.cursor()

    query = """
        UPDATE receta 
        SET Activo = 0, Id_Usuario_Baja = %s, Fecha_Baja = %s 
        WHERE Id_Receta = %s
    """
    
    try:
        cursor.execute(query, (baja_data.id_usuario_baja, baja_data.fecha_baja, id))
        db.commit()
        return {"message": "Receta eliminada con éxito"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar receta: {str(e)}")
    finally:
        cursor.close()
        db.close()
