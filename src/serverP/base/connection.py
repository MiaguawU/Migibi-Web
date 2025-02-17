import pymysql
import os
from dotenv import load_dotenv
from pathlib import Path

# Obtener la ruta del .env en serverP
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"

# Cargar el archivo .env
load_dotenv(ENV_PATH)

# Comprobar si las variables de entorno están cargadas correctamente
print("DB_HOST:", os.getenv("DB_HOST"))
print("DB_USER:", os.getenv("DB_USER"))
print("DB_PASSWORD:", os.getenv("DB_PASSWORD"))
print("DB_NAME:", os.getenv("DB_NAME"))

def get_db_connection():
    """Establece y devuelve una conexión a la base de datos con DictCursor."""
    try:
        connection = pymysql.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            cursorclass=pymysql.cursors.DictCursor  # ✅ Esto es correcto con pymysql
        )
        return connection
    except pymysql.MySQLError as err:
        print(f"❌ Error al conectar con la base de datos: {err}")
        return None
