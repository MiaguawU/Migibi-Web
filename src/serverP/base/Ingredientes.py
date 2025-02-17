from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text
from .connection import get_db_connection

ingredientes_bp = APIRouter()

# Modelo Pydantic para validación de datos
class RecetaDetalleCreate(BaseModel):
    id_alimento: int
    cantidad: float
    id_unidad: int
    Id_Usuario_Alta: int
    Fecha_Alta: Optional[datetime] = None

class RecetaDetalleResponse(BaseModel):
    id: int
    Nombre: str
    Cantidad: float
    Unidad: str
    Activo: bool

# Agregar un ingrediente a una receta
@ingredientes_bp.post("/", response_model=dict)
def create_receta_detalle(data: RecetaDetalleCreate, db: Session = Depends(get_db_connection)):
    Fecha_Alta = data.Fecha_Alta or datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    query = text("""
        INSERT INTO receta_detalle (Id_Receta, Id_Unidad_Medida, Cantidad, Id_Alimento, Id_Usuario_Alta, Fecha_Alta)
        VALUES (:id_receta, :id_unidad, :cantidad, :id_alimento, :Id_Usuario_Alta, :Fecha_Alta)
    """)
    values = {
        "id_receta": 1,  # ID temporal
        "id_alimento": data.id_alimento,
        "id_unidad": data.id_unidad,
        "cantidad": data.cantidad,
        "Id_Usuario_Alta": data.Id_Usuario_Alta,
        "Fecha_Alta": Fecha_Alta,
    }
    db.execute(query, values)
    db.commit()
    
    return {"message": "Ingrediente agregado con éxito"}

# Obtener los detalles de una receta
@ingredientes_bp.get("/{id}", response_model=List[RecetaDetalleResponse])
def get_receta_detalle(id: int, db: Session = Depends(get_db_connection)):
    query = text("""
        SELECT 
            ca.Alimento AS Nombre,
            rd.Cantidad AS Cantidad,
            cu.Abreviatura AS Unidad,
            rd.Id_Receta_Detalle AS id,
            rd.Activo AS Activo
        FROM receta_detalle rd
        LEFT JOIN cat_alimento ca ON rd.Id_Alimento = ca.Id_Alimento
        LEFT JOIN cat_unidad_medida cu ON rd.Id_Unidad_Medida = cu.Id_Unidad_Medida
        WHERE rd.Id_Receta = :id
        ORDER BY ca.Alimento ASC;
    """)
    result = db.execute(query, {"id": id}).fetchall()
    
    if not result:
        raise HTTPException(status_code=404, detail="Detalle de receta no encontrado")
    
    return [RecetaDetalleResponse(**dict(row)) for row in result]

# Actualizar un ingrediente de la receta
@ingredientes_bp.put("/{id}", response_model=dict)
def update_receta_detalle(id: int, data: RecetaDetalleCreate, db: Session = Depends(get_db_connection)):
    Fecha_Alta = data.Fecha_Alta or datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    query = text("""
        UPDATE receta_detalle
        SET Id_Alimento = :id_alimento, Cantidad = :cantidad, Id_Unidad_Medida = :id_unidad,
            Id_Usuario_Alta = :Id_Usuario_Alta, Fecha_Alta = :Fecha_Alta
        WHERE Id_Receta_Detalle = :id
    """)
    values = data.dict()
    values["id"] = id
    values["Fecha_Alta"] = Fecha_Alta

    result = db.execute(query, values)
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Detalle de receta no encontrado")
    
    return {"message": "Ingrediente actualizado con éxito"}

# Eliminar un ingrediente de la receta
@ingredientes_bp.delete("/{id}", response_model=dict)
def delete_receta_detalle(id: int, db: Session = Depends(get_db_connection)):
    query = text("DELETE FROM receta_detalle WHERE Id_Receta_Detalle = :id")
    result = db.execute(query, {"id": id})
    db.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Detalle de receta no encontrado")
    
    return {"message": "Ingrediente eliminado con éxito"}
