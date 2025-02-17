from fastapi import APIRouter, Request, HTTPException, Depends
from jose import JWTError, jwt
from starlette.status import HTTP_401_UNAUTHORIZED

SECRET_KEY = "pollo"
ALGORITHM = "HS256"

logout_bp = APIRouter()

def verify_token(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="No autorizado")

    token = auth_header.split(" ")[1] if "Bearer " in auth_header else None
    if not token:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token inválido")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")

@logout_bp.post("/")
async def logout(request: Request, user=Depends(verify_token)):
    return {"message": "Sesión cerrada correctamente"}
