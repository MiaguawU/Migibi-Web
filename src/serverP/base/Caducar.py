from fastapi import APIRouter, HTTPException
from .connection import get_db_connection
from pydantic import BaseModel
from typing import List

caducar_bp = APIRouter()

class IdsRequest(BaseModel):
    ids: List[int]

@caducar_bp.get("")
def obtener_por_caducar():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    query = """
        SELECT 
            sd.Id_Stock_Detalle AS id,
            ca.Alimento AS Nombre,
            sd.Cantidad AS Cantidad,
            sd.Fecha_Caducidad AS Fecha,
            ca.Id_Usuario_Alta
        FROM stock_detalle sd
        LEFT JOIN cat_alimento ca ON sd.Id_Alimento = ca.Id_Alimento
        WHERE ca.Es_Perecedero = 1 and sd.Activo = 1
        ORDER BY sd.Fecha_Caducidad ASC 
        LIMIT 10;
    """
    cursor.execute(query)
    alimentos = cursor.fetchall()

    cursor.close()
    connection.close()

    if not alimentos:
        raise HTTPException(status_code=404, detail="Alimento no encontrado")

    return {"porcaducar": alimentos}

@caducar_bp.put("/")
def actualizar_alimentos(request: IdsRequest):
    if not request.ids:
        raise HTTPException(status_code=400, detail="Faltan los IDs o no son válidos.")

    connection = get_db_connection()
    cursor = connection.cursor()

    resultados = {"actualizados": [], "errores": []}

    for id in request.ids:
        query = "UPDATE stock_detalle SET Activo = 0, Cantidad = 0 WHERE Id_Stock_Detalle = %s"
        try:
            cursor.execute(query, (id,))
            connection.commit()
            resultados["actualizados"].append(id)
        except Exception as e:
            connection.rollback()
            resultados["errores"].append({"id": id, "error": str(e)})

    cursor.close()
    connection.close()

    return {"message": "Proceso de actualización finalizado.", "resultados": resultados}
