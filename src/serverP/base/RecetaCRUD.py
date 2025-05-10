from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel
from typing import Optional
import shutil
import os
from .connection import get_db_connection

receta_crud_bp = APIRouter()
UPLOAD_DIR = "imagenes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class Receta(BaseModel):
    nombre: str
    tiempo: str
    porciones: int
    calorias: int
    id_tipo_consumo: int

@receta_crud_bp.post("/")
def crear_receta(
    nombre: str = Form(...),
    tiempo: str = Form(...),
    porciones: int = Form(...),
    calorias: int = Form(...),
    id_tipo_consumo: int = Form(...),
    imagen: Optional[UploadFile] = File(None),
    db=Depends(get_db_connection),
):
    image_path = f"/imagenes/defRec.png"
    if imagen:
        file_location = os.path.join(UPLOAD_DIR, imagen.filename)
        with open(file_location, "wb") as f:
            shutil.copyfileobj(imagen.file, f)
        image_path = f"/imagenes/{imagen.filename}"

    query = """
        INSERT INTO receta (Nombre, Id_Tipo_Consumo, Tiempo, Calorias, Imagen_receta)
        VALUES (?, ?, ?, ?, ?)
    """
    cursor = db.cursor()
    cursor.execute(query, (nombre, id_tipo_consumo, tiempo, calorias, image_path))
    db.commit()
    return {"id": cursor.lastrowid, "message": "Receta agregada con éxito"}

@receta_crud_bp.put("/{id}")
def actualizar_receta(
    id: int,
    nombre: str = Form(...),
    tiempo: str = Form(...),
    porciones: int = Form(...),
    calorias: int = Form(...),
    id_tipo_consumo: int = Form(...),
    imagen: Optional[UploadFile] = File(None),
    db=Depends(get_db_connection),
):
    cursor = db.cursor()
    cursor.execute("SELECT Imagen_receta FROM receta WHERE Id_Receta = ?", (id,))
    receta = cursor.fetchone()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    image_path = receta[0] if receta else "/imagenes/defRec.png"
    
    if imagen:
        file_location = os.path.join(UPLOAD_DIR, imagen.filename)
        with open(file_location, "wb") as f:
            shutil.copyfileobj(imagen.file, f)
        image_path = f"/imagenes/{imagen.filename}"
    
    query = """
        UPDATE receta SET Nombre = ?, Id_Tipo_Consumo = ?, Tiempo = ?, Porciones = ?, Calorias = ?, Imagen_receta = ?
        WHERE Id_Receta = ?
    """
    cursor.execute(query, (nombre, id_tipo_consumo, tiempo, porciones, calorias, image_path, id))
    db.commit()
    return {"message": "Receta actualizada con éxito"}

@receta_crud_bp.delete("/{id}")
def eliminar_receta(id: int, db=Depends(get_db_connection)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM receta_detalle WHERE Id_Receta = ?", (id,))
    cursor.execute("DELETE FROM receta WHERE Id_Receta = ?", (id,))
    db.commit()
    return {"message": "Receta eliminada con éxito"}

@receta_crud_bp.get("/{id}")
def obtener_receta(id: int, db=Depends(get_db_connection)):
    query = """
        SELECT Nombre, Calorias, Id_Tipo_Consumo, Imagen_receta, Tiempo, Porciones
        FROM receta WHERE Id_Receta = ?
    """
    cursor = db.cursor()
    cursor.execute(query, (id,))
    receta = cursor.fetchone()
    if not receta:
        raise HTTPException(status_code=404, detail="Receta no encontrada")
    return {
        "nombre": receta[0],
        "calorias": receta[1],
        "id_tipo_consumo": receta[2],
        "imagen": receta[3],
        "tiempo": receta[4],
        "porciones": receta[5],
    }
