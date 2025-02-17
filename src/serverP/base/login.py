from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .connection import get_db_connection
import pymysql
from jose import jwt  # ✅ Importamos JWT
from datetime import datetime, timedelta

SECRET_KEY = "pollo"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # 1 hora

login_bp = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@login_bp.post("/")
def login_user(data: LoginRequest):
    username = data.username
    password = data.password

    if not username or not password:
        raise HTTPException(status_code=400, detail="Faltan datos requeridos: username y password")

    conn = get_db_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            query = "SELECT * FROM usuario WHERE Email = %s" if username.endswith("@gmail.com") else "SELECT * FROM usuario WHERE Nombre_Usuario = %s"
            cursor.execute(query, (username,))
            user = cursor.fetchone()

            if not user:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")

            if user["Contrasena"] != password:
                raise HTTPException(status_code=401, detail="Contraseña incorrecta")

            # ✅ Generamos el token
            token_data = {"sub": user["Nombre_Usuario"], "id": user["Id_Usuario"]}
            access_token = create_access_token(data=token_data, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

            return {
                "token": access_token,  # ✅ Ahora enviamos el token
                "id": user["Id_Usuario"],
                "username": user["Nombre_Usuario"],
                "foto_perfil": user["foto_perfil"],
                "Cohabitantes": user["Cohabitantes"],
                "Email": user["Email"],
                "message": "Sesión iniciada con éxito",
            }
    finally:
        conn.close()
