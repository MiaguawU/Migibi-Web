from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from .connection import get_db_connection

tipo_consumo_bp = APIRouter()

# Modelo de datos para validación
class TipoConsumoBase(BaseModel):
    Tipo_Consumo: str

class TipoConsumoCreate(TipoConsumoBase):
    Id_Usuario_Alta: int

class TipoConsumoUpdate(TipoConsumoBase):
    Id_Usuario_Modif: int

class TipoConsumoDelete(BaseModel):
    Id_Usuario_Baja: int

# Obtener todos los registros
@tipo_consumo_bp.get("/")
def obtener_tipos_consumo():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT Id_Tipo_Consumo, Tipo_Consumo FROM cat_tipo_consumo;")
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return resultados

# Crear un nuevo registro
@tipo_consumo_bp.post("/")
def crear_tipo_consumo(tipo_consumo: TipoConsumoCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now()
    query = """
        INSERT INTO cat_tipo_consumo (Tipo_Consumo, Activo, Id_Usuario_Alta, Fecha_Alta)
        VALUES (%s, 1, %s, %s)
    """
    cursor.execute(query, (tipo_consumo.Tipo_Consumo, tipo_consumo.Id_Usuario_Alta, now))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"message": "Registro creado", "id": new_id}

# Actualizar un registro
@tipo_consumo_bp.put("/{id}")
def actualizar_tipo_consumo(id: int, tipo_consumo: TipoConsumoUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now()
    query = """
        UPDATE cat_tipo_consumo
        SET Tipo_Consumo = %s, Id_Usuario_Modif = %s, Fecha_Modif = %s
        WHERE Id_Tipo_Consumo = %s
    """
    cursor.execute(query, (tipo_consumo.Tipo_Consumo, tipo_consumo.Id_Usuario_Modif, now, id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Registro actualizado"}

# Eliminar (desactivar) un registro
@tipo_consumo_bp.delete("/{id}")
def eliminar_tipo_consumo(id: int, tipo_consumo: TipoConsumoDelete):
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now()
    query = """
        UPDATE cat_tipo_consumo
        SET Activo = 0, Id_Usuario_Baja = %s, Fecha_Baja = %s
        WHERE Id_Tipo_Consumo = %s
    """
    cursor.execute(query, (tipo_consumo.Id_Usuario_Baja, now, id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Registro eliminado (desactivado)"}