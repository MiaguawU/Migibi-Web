from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict
from .connection import get_db_connection
import logging

alimento_inactivo_bp = APIRouter()

class AlimentoEliminarResponse(BaseModel):
    id: int
    message: str

@alimento_inactivo_bp.put("/{id}", response_model=AlimentoEliminarResponse)
async def eliminar_alimento(id: int, db=Depends(get_db_connection)):
    try:
        query1 = "UPDATE cat_alimento SET Activo = 0 WHERE Id_Alimento = ?"
        query2 = "UPDATE stock_detalle SET Activo = 0 WHERE Id_Alimento = ?"

        cursor = db.cursor()
        cursor.execute(query1, (id,))
        cursor.execute(query2, (id,))
        db.commit()
        cursor.close()

        logging.info("Alimento inactivo")
        return {"id": id, "message": "Alimento eliminado con éxito"}
    except Exception as e:
        logging.error(f"Error al eliminar el alimento: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al eliminar el alimento")
