from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from .connection import get_db_connection
from typing import List

procedimiento_real_bp = APIRouter()

class InstruccionSchema(BaseModel):
    instruccion: str
    orden: int
    id_usuario_alta: int
    fecha_alta: datetime

# Crear una nueva instrucción
@procedimiento_real_bp.post("/")
async def crear_instruccion(instruccion: InstruccionSchema):
    id_receta = 1  # ID temporal hasta obtener el real
    query = """
        INSERT INTO receta_instrucciones (Id_Receta, Instruccion, Orden, Id_Usuario_Alta, Fecha_Alta)
        VALUES (?, ?, ?, ?, ?)
    """
    values = (id_receta, instruccion.instruccion, instruccion.orden, instruccion.id_usuario_alta, instruccion.fecha_alta)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Instrucción agregada con éxito"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al agregar instrucción: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Obtener todas las instrucciones de una receta específica
@procedimiento_real_bp.get("/{id}", response_model=List[InstruccionSchema])
async def obtener_instrucciones(id: int):
    query = """
        SELECT Instruccion AS instruccion, Orden AS orden, Id_Usuario_Alta AS id_usuario_alta, Fecha_Alta AS fecha_alta
        FROM receta_instrucciones
        WHERE Id_Receta = ?
        ORDER BY Orden ASC
    """
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, (id,))
        results = cursor.fetchall()
        return [InstruccionSchema(**dict(zip([column[0] for column in cursor.description], row))) for row in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener instrucciones: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Actualizar una instrucción
@procedimiento_real_bp.put("/{id}")
async def actualizar_instruccion(id: int, instruccion: InstruccionSchema):
    query = """
        UPDATE receta_instrucciones
        SET Instruccion = ?, Orden = ?, Id_Usuario_Alta = ?, Fecha_Alta = ?
        WHERE Id_Receta_Instrucciones = ?
    """
    values = (instruccion.instruccion, instruccion.orden, instruccion.id_usuario_alta, instruccion.fecha_alta, id)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Instrucción no encontrada")
        return {"message": "Instrucción actualizada con éxito"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar instrucción: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Eliminar una instrucción
@procedimiento_real_bp.delete("/{id}")
async def eliminar_instruccion(id: int):
    query = "DELETE FROM receta_instrucciones WHERE Id_Receta_Instrucciones = ?"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, (id,))
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Instrucción no encontrada")
        return {"message": "Instrucción eliminada con éxito"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar instrucción: {str(e)}")
    finally:
        cursor.close()
        conn.close()
