from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from pydantic import BaseModel, constr
import os
import shutil
import mysql.connector
from .connection import get_db_connection

usuario_router = APIRouter()  # Corregido aquí
UPLOAD_DIR = "../imagenes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Modelo para usuario
class User(BaseModel):
    username: constr(strip_whitespace=True, min_length=1)
    password: constr(strip_whitespace=True, min_length=1)

# Obtener usuario

@usuario_router.get("/")
def get_user(id_us: int = Query(default=..., description="ID del usuario")):
    print(f"🔍 Buscando usuario con ID: {id_us}")  # Debugging

    db = get_db_connection()
    if not db:
        print("❌ No se pudo conectar a la base de datos.")
        raise HTTPException(status_code=500, detail="Error en la base de datos")

    cursor = db.cursor()  # ❌ Quita dictionary=True, ya no es necesario con DictCursor

    try:
        cursor.execute("SELECT * FROM usuario WHERE Id_Usuario = %s", (id_us,))
        user = cursor.fetchone()

        if not user:
            print("⚠️ Usuario no encontrado")
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        print("✅ Usuario encontrado:", user)
        return user

    except pymysql.MySQLError as err:  # ✅ Usa pymysql.MySQLError en lugar de mysql.connector.Error
        print(f"❌ Error SQL: {err}")
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {str(err)}")

    except Exception as e:
        print(f"❌ Error inesperado: {type(e).__name__} - {e}")
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")

    finally:
        cursor.close()
        db.close()


# Actualizar usuario
@usuario_router.put("/{id}")
def update_user(
    id: int,
    Nombre_Usuario: str = Form(None),
    Cohabitantes: str = Form(None),
    Email: str = Form(None),
    foto_perfil: UploadFile = File(None)  # ✅ Correcto para archivos
):

    print(id,Nombre_Usuario,Cohabitantes,Email,foto_perfil)
    db = get_db_connection()
    if not db:
        raise HTTPException(status_code=500, detail="Error en la base de datos")

    cursor = db.cursor()
    data = []
    query_parts = []

    if Nombre_Usuario:
        query_parts.append("Nombre_Usuario = %s")
        data.append(Nombre_Usuario)
    if Cohabitantes:
        query_parts.append("Cohabitantes = %s")
        data.append(Cohabitantes)
    if Email:
        query_parts.append("Email = %s")
        data.append(Email)
    if foto_perfil:
        ext = os.path.splitext(foto_perfil.filename)[1]  
        file_path = f"uploads/{uuid.uuid4().hex}{ext}"  
        with open(file_path, "wb") as f:
            shutil.copyfileobj(foto_perfil.file, f)
        query_parts.append("foto_perfil = %s")
        data.append(file_path)

    if not query_parts:
        raise HTTPException(status_code=400, detail="No se enviaron datos para actualizar")

    query = f"UPDATE usuario SET {', '.join(query_parts)} WHERE Id_Usuario = %s"
    data.append(id)

    try:
        cursor.execute(query, tuple(data))
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return {"message": "Usuario actualizado con éxito"}

    except pymysql.MySQLError as err:
        raise HTTPException(status_code=500, detail="Error en la base de datos")

    finally:
        cursor.close()
        db.close()


# Agregar usuario
@usuario_router.post("/")
def add_user(user: User):
    print(f"Datos recibidos: {user}") 
    db = get_db_connection()
    cursor = db.cursor()
    query = "INSERT INTO usuario (Nombre_Usuario, Contrasena, foto_perfil) VALUES (%s, %s, %s)"
    values = (user.username, user.password, "/imagenes/defaultPerfil.png")
    cursor.execute(query, values)
    db.commit()
    user_id = cursor.lastrowid
    cursor.close()
    db.close()
    
    return {"id": user_id, "message": "Usuario agregado con éxito"}
