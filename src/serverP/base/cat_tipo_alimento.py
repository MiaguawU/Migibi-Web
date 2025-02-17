from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
from .connection import get_db_connection
from typing import List
import aiofiles
import uuid
import os

tipo_alimento_bp = APIRouter()

UPLOAD_DIR = "imagenes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class TipoAlimentoSchema(BaseModel):
    tipo_alimento: str
    id_usuario_alta: int
    fecha_alta: datetime

# Crear un nuevo tipo de alimento
@tipo_alimento_bp.post("/")
async def crear_tipo_alimento(tipo_alimento: TipoAlimentoSchema):
    query = """
        INSERT INTO cat_tipo_alimento (Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta)
        VALUES (?, ?, ?)
    """
    values = (tipo_alimento.tipo_alimento, tipo_alimento.id_usuario_alta, tipo_alimento.fecha_alta)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Tipo de alimento agregado con éxito"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al agregar tipo de alimento: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Obtener todos los tipos de alimento
@tipo_alimento_bp.get("/", response_model=List[TipoAlimentoSchema])
async def obtener_tipos_alimento():
    query = "SELECT Tipo_Alimento, Id_Usuario_Alta, Fecha_Alta FROM cat_tipo_alimento"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return [TipoAlimentoSchema(**dict(zip([column[0] for column in cursor.description], row))) for row in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tipos de alimento: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Subir una imagen
@tipo_alimento_bp.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(("png", "jpg", "jpeg")):
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes PNG, JPG o JPEG")
    
    file_name = f"{uuid.uuid4()}-{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)
    
    return {"filename": file_name, "message": "Imagen subida con éxito"}

# Eliminar un tipo de alimento (baja lógica)
@tipo_alimento_bp.delete("/{id}")
async def eliminar_tipo_alimento(id: int, id_usuario_baja: int, fecha_baja: datetime):
    query = """
        UPDATE cat_tipo_alimento 
        SET Activo = 0, Id_Usuario_Baja = ?, Fecha_Baja = ?
        WHERE Id_Tipo_Alimento = ?
    """
    values = (id_usuario_baja, fecha_baja, id)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Tipo de alimento no encontrado")
        return {"message": "Tipo de alimento eliminado con éxito"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar tipo de alimento: {str(e)}")
    finally:
        cursor.close()
        conn.close()
