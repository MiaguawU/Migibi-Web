from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, constr
from sqlalchemy.orm import Session
from datetime import datetime
from .connection import get_db_connection

ingrediente_real_bp = APIRouter()

# Modelo para la validación de ingredientes
class IngredienteSchema(BaseModel):
    nombre: constr(strip_whitespace=True, min_length=1)
    cantidad: int
    id_unidad: int

# Agregar un ingrediente a una receta
@ingrediente_real_bp.post("/{id}")
async def agregar_ingrediente(id: int, ingrediente: IngredienteSchema, Id_Usuario_Alta: int, db: Session = Depends(get_db_connection)):
    Fecha_Alta = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Verificar si el alimento ya existe
    alimento_result = db.execute(
        "SELECT Id_Alimento FROM cat_alimento WHERE Alimento = :nombre",
        {"nombre": ingrediente.nombre}
    ).fetchone()

    if alimento_result:
        Id_Alimento = alimento_result[0]
    else:
        # Insertar un nuevo alimento
        result = db.execute(
            """INSERT INTO cat_alimento (Alimento, Id_Tipo_Alimento, Es_Perecedero, Imagen_alimento, Activo, Id_Usuario_Alta, Fecha_Alta)
               VALUES (:nombre, 1, 0, '/imagenes/defIng.png', 0, :usuario, :fecha)""",
            {"nombre": ingrediente.nombre, "usuario": Id_Usuario_Alta, "fecha": Fecha_Alta}
        )
        db.commit()
        Id_Alimento = result.lastrowid

        # Insertar en stock_detalle
        db.execute(
            """INSERT INTO stock_detalle (Id_Unidad_Medida, Cantidad, Id_Alimento, Es_Perecedero, Id_Usuario_Alta, Fecha_Alta)
               VALUES (:id_unidad, :cantidad, :id_alimento, 0, :usuario, :fecha)""",
            {"id_unidad": ingrediente.id_unidad, "cantidad": ingrediente.cantidad, "id_alimento": Id_Alimento, "usuario": Id_Usuario_Alta, "fecha": Fecha_Alta}
        )
        db.commit()

    # Agregar a receta_detalle
    db.execute(
        """INSERT INTO receta_detalle (Id_Receta, Id_Alimento, Cantidad, Id_Unidad_Medida, Id_Usuario_Alta, Fecha_Alta)
           VALUES (:id_receta, :id_alimento, :cantidad, :id_unidad, :usuario, :fecha)""",
        {"id_receta": id, "id_alimento": Id_Alimento, "cantidad": ingrediente.cantidad, "id_unidad": ingrediente.id_unidad, "usuario": Id_Usuario_Alta, "fecha": Fecha_Alta}
    )
    db.commit()

    return {"message": "Ingrediente agregado exitosamente."}

# Eliminar un ingrediente de la receta
@ingrediente_real_bp.put("/")
async def eliminar_ingredientes(ids: list[int], db: Session = Depends(get_db_connection)):
    if not ids:
        raise HTTPException(status_code=400, detail="Faltan los IDs o no son válidos.")

    resultados = {"actualizados": [], "errores": []}

    for id in ids:
        try:
            db.execute(
                "UPDATE receta_detalle SET Activo = 0 WHERE Id_Receta_Detalle = :id",
                {"id": id}
            )
            db.commit()
            resultados["actualizados"].append(id)
        except Exception as e:
            resultados["errores"].append({"id": id, "error": str(e)})

    return {"message": "Proceso de actualización finalizado.", "resultados": resultados}
