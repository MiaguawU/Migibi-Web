from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv
from pathlib import Path
from serverP.base.connection import get_db_connection

# Importar rutas
from serverP.base.usuario import usuario_router
from serverP.base.usuarioGmail import usuario_gmail_bp
from serverP.base.login import login_bp
from serverP.base.Logout import logout_bp
from serverP.base.receta import receta_general_bp
from serverP.base.Alimento import alimento_bp
from serverP.base.Caducar import caducar_bp
from serverP.base.AlimentoInactivo import alimento_inactivo_bp
from serverP.base.IngredienteREAL import ingrediente_real_bp
from serverP.base.Ingredientes import ingredientes_bp
from serverP.base.RecetaCRUD import receta_crud_bp
from serverP.base.cat_tipo_consumo import tipo_consumo_bp
from serverP.base.Procedimiento import procedimiento_bp
from serverP.base.ProcedimientoREAL import procedimiento_real_bp
from serverP.base.cat_tipo_alimento import tipo_alimento_bp
from serverP.base.cat_unidad_medida import unidad_medida_bp
from serverP.base.recetaSecreta import receta_secreta_bp
from serverP.base.receta_diaGeneral import recetas_dia_general_router
from serverP.base.receta_diaDesayuno import recetas_dia_desayuno_router
from serverP.base.receta_diaComida import recetas_dia_comida_router
from serverP.base.receta_diaCena import recetas_dia_cena_bp
from serverP.base.HoyGeneral import hoy_general_bp

# Obtener la ruta del .env en serverP
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

# Cargar el archivo .env
load_dotenv(ENV_PATH)

# Crear instancia de FastAPI
app = FastAPI(title="Mi API con FastAPI", version="1.0.0", redirect_slashes=False)

# Agregar middleware de sesiones con una clave secreta
app.add_middleware(SessionMiddleware, secret_key="pollo", session_cookie="sessionid")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas de usuarios y autenticación
app.include_router(usuario_router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(usuario_gmail_bp, prefix="/usuarioGmail", tags=["Usuario Gmail"])
app.include_router(login_bp, prefix="/login", tags=["Login"])
app.include_router(logout_bp, prefix="/logout", tags=["Logout"])

# Rutas de recetas
app.include_router(receta_general_bp, prefix="/recetaGeneral", tags=["Recetas Generales"])
app.include_router(receta_crud_bp, prefix="/recetaCRUD", tags=["Recetas CRUD"])
app.include_router(receta_secreta_bp, prefix="/agReceta", tags=["Agregar Receta"])

# Rutas de ingredientes
app.include_router(ingrediente_real_bp, prefix="/ingED", tags=["Ingredientes ED"])
app.include_router(ingredientes_bp, prefix="/ingredientes", tags=["Ingredientes"])

# Rutas de consumo y procedimiento
app.include_router(tipo_consumo_bp, prefix="/tipoC", tags=["Tipos de Consumo"])
app.include_router(procedimiento_bp, prefix="/proceso", tags=["Procedimientos"])
app.include_router(procedimiento_real_bp, prefix="/proED", tags=["Procedimientos ED"])

# Rutas de alimentos
app.include_router(alimento_bp, prefix="/alimento", tags=["Alimentos"])
app.include_router(caducar_bp, prefix="/caducar", tags=["Caducar"])
app.include_router(alimento_inactivo_bp, prefix="/alimentoInactivo", tags=["Alimentos Inactivos"])

# Rutas de categorías
app.include_router(tipo_alimento_bp, prefix="/tipoA", tags=["Tipos de Alimentos"])
app.include_router(unidad_medida_bp, prefix="/unidad", tags=["Unidades de Medida"])

# Rutas de planificación de recetas
app.include_router(recetas_dia_general_router, prefix="/planGeneral", tags=["Planificación General"])
app.include_router(recetas_dia_desayuno_router, prefix="/editarDesayuno", tags=["Editar Desayuno"])
app.include_router(recetas_dia_comida_router, prefix="/editarComida", tags=["Editar Comida"])
app.include_router(recetas_dia_cena_bp, prefix="/editarCena", tags=["Editar Cena"])

# Rutas de planificación diaria
app.include_router(hoy_general_bp, prefix="/hoyGeneral", tags=["Hoy General"])

# Ejecutar servidor
if __name__ == "__main__":
    import uvicorn
    PORT = int(os.getenv("SERVER_PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=PORT, reload=True)
