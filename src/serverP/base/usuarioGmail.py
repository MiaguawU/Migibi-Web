from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel
from typing import Optional, List
import shutil
import os
import aiofiles
from .connection import get_db_connection

usuario_gmail_bp = APIRouter()

UPLOAD_DIR = "imagenes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Modelos Pydantic
class UsuarioResponse(BaseModel):
    id: int
    Nombre_Usuario: str
    Email: str
    Cohabitantes: Optional[int] = None
    foto_perfil: Optional[str] = None

class UsuarioCreate(BaseModel):
    username: str
    password: str

# Obtener todos los usuarios
@usuario_gmail_bp.get("/", response_model=List[UsuarioResponse])
async def get_usuarios():
    conn = await get_db_connection()
    try:
        async with conn.cursor() as cursor:
            await cursor.execute("SELECT * FROM usuario")
            usuarios = await cursor.fetchall()
            return [
                {"id": u[0], "Nombre_Usuario": u[1], "Email": u[2], "Cohabitantes": u[3], "foto_perfil": u[4]}
                for u in usuarios
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# Actualizar usuario
@usuario_gmail_bp.put("/{id}", response_model=dict)
async def update_usuario(
    id: int,
    Nombre_Usuario: str = Form(...),
    Contrasena: str = Form(...),
    Email: str = Form(...),
    Cohabitantes: Optional[int] = Form(None),
    foto_perfil: UploadFile = File(None),
):
    conn = await get_db_connection()
    foto_path = None

    # Guardar imagen si se proporciona
    if foto_perfil:
        foto_path = f"{UPLOAD_DIR}/{foto_perfil.filename}"
        async with aiofiles.open(foto_path, "wb") as buffer:
            await buffer.write(await foto_perfil.read())

    query = """
        UPDATE usuario 
        SET Nombre_Usuario = %s, Contrasena = %s, Email = %s, Cohabitantes = %s, foto_perfil = %s
        WHERE Id_Usuario = %s
    """
    values = (Nombre_Usuario, Contrasena, Email, Cohabitantes, foto_path, id)

    try:
        async with conn.cursor() as cursor:
            await cursor.execute(query, values)
            await conn.commit()
            return {"message": "Usuario actualizado con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# Registrar usuario
@usuario_gmail_bp.post("/", response_model=dict)
async def create_usuario(
    username: str = Form(...),
    password: str = Form(...),
    foto_perfil: UploadFile = File(None),
):
    conn = await get_db_connection()
    email = username
    name = "usuario_gmail"

    # Guardar imagen o asignar default
    foto_path = f"{UPLOAD_DIR}/{foto_perfil.filename}" if foto_perfil else "imagenes/defaultPerfil.png"
    if foto_perfil:
        async with aiofiles.open(foto_path, "wb") as buffer:
            await buffer.write(await foto_perfil.read())

    query = "INSERT INTO usuario (Nombre_Usuario, Email, Contrasena, foto_perfil) VALUES (%s, %s, %s, %s)"
    values = (name, email, password, foto_path)

    try:
        async with conn.cursor() as cursor:
            await cursor.execute(query, values)
            await conn.commit()
            return {"message": "Usuario agregado con éxito"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await conn.close()

# Eliminar usuario