from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector
from .connection import get_db_connection

# Crear el router con prefijo y etiquetas
recetas_dia_comida_router = APIRouter()

# Modelos de validación con Pydantic
class IngredienteSchema(BaseModel):
    id_receta: int
    Id_Usuario_Alta: int

class EliminarSchema(BaseModel):
    Id_Usuario_Modif: int

# Actualizar receta de comida
@recetas_dia_comida_router.put("/{Id_Recetas_Dia}")
def actualizar_comida(Id_Recetas_Dia: int, data: IngredienteSchema):
    query = """
        UPDATE recetas_dia
        SET Id_Receta_Comida = %s, Id_Usuario_Modif = %s, Fecha_Modif = NOW()
        WHERE Id_Recetas_Dia = %s
    """

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, (data.id_receta, data.Id_Usuario_Alta, Id_Recetas_Dia))
        conn.commit()
        return {"message": "Comida actualizada con éxito"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail={"message": "Error interno del servidor", "error": str(err)})
    finally:
        cursor.close()
        conn.close()

# Eliminar (borrado lógico) receta de comida
@recetas_dia_comida_router.put("/borrar/{Id_Recetas_Dia}")
def eliminar_comida(Id_Recetas_Dia: int, data: EliminarSchema):
    query = """
        UPDATE recetas_dia
        SET Id_Receta_Comida = NULL, Id_Usuario_Modif = %s, Fecha_Modif = NOW()
        WHERE Id_Recetas_Dia = %s
    """

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, (data.Id_Usuario_Modif, Id_Recetas_Dia))
        conn.commit()
        return {"message": "Comida eliminada"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail={"message": "Error interno del servidor", "error": str(err)})
    finally:
        cursor.close()
        conn.close()
