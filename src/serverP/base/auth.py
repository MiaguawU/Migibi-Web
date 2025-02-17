from fastapi import APIRouter, Depends, Request
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse
import httpx
import os
from .connection import get_db_connection
import sqlalchemy

router = APIRouter()
oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("SESSION_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://oauth2.googleapis.com/token",
    access_token_params=None,
    client_kwargs={"scope": "openid email profile"},
)

@router.get("/auth/google")
def auth_google(request: Request):
    redirect_uri = f"{os.getenv('BASE_URL', 'http://localhost:8000')}/auth/google/callback"
    return oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def auth_google_callback(request: Request, db: sqlalchemy.engine.Connection = Depends(get_db_connection)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    if not user_info:
        return RedirectResponse(url="/")
    
    email = user_info["email"]
    nombre = user_info["name"]
    foto_perfil = user_info["picture"]
    
    existing_user = db.execute(
        "SELECT * FROM usuario WHERE Email = :email", {"email": email}
    ).fetchone()
    
    if existing_user:
        if existing_user.Nombre_Usuario != nombre or existing_user.foto_perfil != foto_perfil:
            db.execute(
                "UPDATE usuario SET Nombre_Usuario = :nombre, foto_perfil = :foto_perfil WHERE Email = :email",
                {"nombre": nombre, "foto_perfil": foto_perfil, "email": email},
            )
        user_data = dict(existing_user)
    else:
        contrasena_predeterminada = "sopaDEpollo22"
        result = db.execute(
            "INSERT INTO usuario (Nombre_Usuario, Email, foto_perfil, Es_Gmail, Contrasena) VALUES (:nombre, :email, :foto, :es_gmail, :contrasena) RETURNING Id_Usuario",
            {"nombre": nombre, "email": email, "foto": foto_perfil, "es_gmail": 1, "contrasena": contrasena_predeterminada},
        )
        user_id = result.fetchone()["Id_Usuario"]
        user_data = {"Id_Usuario": user_id, "Nombre_Usuario": nombre, "Email": email, "foto_perfil": foto_perfil, "Es_Gmail": 1}
    
    # Guardar sesión de usuario (opcional)
    request.session["user"] = user_data
    return RedirectResponse(url="/")
