from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, conint, constr
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import shutil
import os
from .connection import get_db_connection
from flask import Blueprint

alimento_bp = APIRouter()
UPLOAD_DIR = "imagenes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class AlimentoSchema(BaseModel):
    nombre: constr(strip_whitespace=True, min_length=1)
    tipo: conint(gt=0)
    id_unidad: conint(gt=0)
    cantidad: conint(gt=0)
    fecha_caducidad: str | None = None
    Id_Usuario_Alta: conint(gt=0)

def format_fecha(fecha: str | None):
    if fecha:
        try:
            return datetime.fromisoformat(fecha).strftime("%Y-%m-%d %H:%M:%S")
        except ValueError:
            return None
    return None

@alimento_bp.post("/")
async def agregar_alimento(
    nombre: str = Form(...),
    tipo: int = Form(...),
    id_unidad: int = Form(...),
    cantidad: int = Form(...),
    fecha_caducidad: str = Form(None),
    Id_Usuario_Alta: int = Form(...),
    image: UploadFile | None = File(None),
    db: AsyncSession = Depends(get_db_connection)
):
    fecha_cad = format_fecha(fecha_caducidad)
    es_perecedero = 1 if fecha_cad else 0
    fecha_alta = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    imagen = "imagenes/defIng.png"

    if image:
        filename = f"{int(datetime.timestamp(datetime.now()))}-{image.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        imagen = filepath

    async with db.begin():
        result = await db.execute(text(
            "SELECT Id_Alimento FROM cat_alimento WHERE Id_Usuario_Alta = :user AND Alimento = :nombre AND Es_Perecedero = 0 AND Activo = 1"
        ), {"user": Id_Usuario_Alta, "nombre": nombre})
        existencia = result.fetchone()

        if existencia:
            await db.execute(text(
                "UPDATE stock_detalle SET Total = Total + :cantidad, Cantidad = Cantidad + :cantidad WHERE Id_Alimento = :id"
            ), {"cantidad": cantidad, "id": existencia[0]})
            await db.commit()
            return {"message": "Cantidad actualizada correctamente"}

        result = await db.execute(text(
            "INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Imagen_alimento, Id_Usuario_Alta, Fecha_Alta) VALUES (:nombre, :tipo, :es_perecedero, :imagen, :user, :fecha) RETURNING Id_Alimento"
        ), {"nombre": nombre, "tipo": tipo, "es_perecedero": es_perecedero, "imagen": imagen, "user": Id_Usuario_Alta, "fecha": fecha_alta})
        Id_Alimento = result.fetchone()[0]

        await db.execute(text(
            "INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Total, Fecha_Caducidad, Id_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta) VALUES (:unidad, :cantidad, :cantidad, :fecha_cad, :id_alimento, :es_perecedero, :user, :fecha)"
        ), {"unidad": id_unidad, "cantidad": cantidad, "fecha_cad": fecha_cad, "id_alimento": Id_Alimento, "es_perecedero": es_perecedero, "user": Id_Usuario_Alta, "fecha": fecha_alta})
        await db.commit()

    return {"message": "Alimento agregado exitosamente", "alimento": {"id": Id_Alimento, "nombre": nombre, "tipo": tipo, "es_perecedero": es_perecedero, "imagen": imagen}}

@alimento_bp.get("/")
async def obtener_alimentos(db: AsyncSession = Depends(get_db_connection)):
    query1 = text("""
        SELECT ca.Id_Alimento AS id, ca.Alimento AS Nombre, ca.Activo, sd.Cantidad, cum.Abreviatura AS Unidad,
               ca.Imagen_alimento AS Imagen, sd.Fecha_Caducidad, ca.Id_Usuario_Alta, cta.Tipo_Alimento
        FROM stock_detalle sd
        LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
        LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
        LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
        WHERE ca.Es_Perecedero = 1
        ORDER BY sd.Fecha_Caducidad ASC;
    """)
    query2 = text("""
        SELECT ca.Id_Alimento AS id, ca.Alimento AS Nombre, ca.Activo, sd.Cantidad, cum.Abreviatura AS Unidad,
               ca.Imagen_alimento AS Imagen, ca.Id_Usuario_Alta, cta.Tipo_Alimento
        FROM stock_detalle sd
        LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
        LEFT JOIN cat_unidad_medida cum ON sd.Id_Unidad_Medida = cum.Id_Unidad_Medida
        LEFT JOIN cat_tipo_alimento cta ON ca.Id_Tipo_Alimento = cta.Id_Tipo_Alimento
        WHERE ca.Es_Perecedero = 0
        ORDER BY sd.Fecha_Caducidad ASC;
    """)

    async with db.begin():
        result1 = await db.execute(query1)
        result2 = await db.execute(query2)
        return {"Perecedero": result1.mappings().all(), "NoPerecedero": result2.mappings().all()}

@alimento_bp.get("/{id}")
async def obtener_alimento(id: int, db: AsyncSession = Depends(get_db_connection)):
    query = text("""
        SELECT ca.Alimento AS Nombre, sd.Cantidad, sd.Id_Unidad_Medida AS id_unidad,
               ca.Id_Tipo_Alimento AS id_tipo, sd.Fecha_Caducidad AS Fecha
        FROM stock_detalle sd
        JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
        WHERE ca.Id_Alimento = :id;
    """)

    async with db.begin():
        result = await db.execute(query, {"id": id})
        alimento = result.mappings().first()
        if alimento:
            return alimento
        raise HTTPException(status_code=404, detail="No se encontró el alimento")
