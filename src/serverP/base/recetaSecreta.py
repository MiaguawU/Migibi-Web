from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
from .connection import get_db_connection
from typing import List
import aiofiles
import uuid
import os

receta_secreta_bp = APIRouter()

UPLOAD_DIR = "imagenes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class TipoAlimentoSchema(BaseModel):
    tipo_alimento: str
    id_usuario_alta: int
    fecha_alta: datetime

class UnidadMedidaSchema(BaseModel):
    unidad_medida: str
    abreviatura: str
    id_usuario_alta: int
    fecha_alta: datetime

# Obtener el último ID de receta
@receta_secreta_bp.get("/receta/ultimo-id/")
async def obtener_ultimo_id_receta():
    query = """
        SELECT Id_Receta 
        FROM receta 
        ORDER BY Id_Receta DESC 
        LIMIT 1
    """
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query)
        result = cursor.fetchone()
        if result is None:
            raise HTTPException(status_code=404, detail="No se encontraron recetas")
        return {"id": result[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el último ID de receta: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Crear un nuevo tipo de alimento
@receta_secreta_bp.post("/tipo-alimento/")
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
@receta_secreta_bp.get("/tipo-alimento/", response_model=List[TipoAlimentoSchema])
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

# Crear una nueva unidad de medida
@receta_secreta_bp.post("/unidad-medida/")
async def crear_unidad_medida(unidad_medida: UnidadMedidaSchema):
    query = """
        INSERT INTO cat_unidad_medida (Unidad_Medida, Abreviatura, Id_Usuario_Alta, Fecha_Alta)
        VALUES (?, ?, ?, ?)
    """
    values = (unidad_medida.unidad_medida, unidad_medida.abreviatura, unidad_medida.id_usuario_alta, unidad_medida.fecha_alta)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query, values)
        conn.commit()
        return {"id": cursor.lastrowid, "message": "Unidad de medida agregada con éxito"}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al agregar unidad de medida: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Obtener todas las unidades de medida
@receta_secreta_bp.get("/unidad-medida/", response_model=List[UnidadMedidaSchema])
async def obtener_unidades_medida():
    query = "SELECT Unidad_Medida, Abreviatura, Id_Usuario_Alta, Fecha_Alta FROM cat_unidad_medida"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(query)
        results = cursor.fetchall()
        return [UnidadMedidaSchema(**dict(zip([column[0] for column in cursor.description], row))) for row in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener unidades de medida: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Subir una imagen
@receta_secreta_bp.post("/upload/")
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
@receta_secreta_bp.delete("/tipo-alimento/{id}")
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
