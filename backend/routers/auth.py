from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from database import get_db
import models
import bcrypt
import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ─── Schemas ───────────────────────────────────────────────────────────────────

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ChangeUsernameRequest(BaseModel):
    new_username: str

# ─── Helpers ───────────────────────────────────────────────────────────────────

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.SystemUser).filter(models.SystemUser.username == username).first()
    if user is None or not user.is_active:
        raise credentials_exception
    return user

def require_roles(*roles):
    def role_checker(current_user: models.SystemUser = Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action"
            )
        return current_user
    return role_checker

# ─── Routes ────────────────────────────────────────────────────────────────────

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.SystemUser).filter(
        models.SystemUser.username == form_data.username
    ).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    user.last_login = datetime.utcnow()
    db.commit()
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "username": user.username
    }

@router.get("/me")
def get_me(current_user: models.SystemUser = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role,
        "staff_id": current_user.staff_id
    }

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    if not verify_password(data.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(data.new_password) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters")
    current_user.password_hash = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}

@router.post("/change-username")
def change_username(
    data: ChangeUsernameRequest,
    db: Session = Depends(get_db),
    current_user: models.SystemUser = Depends(get_current_user)
):
    if not data.new_username.strip():
        raise HTTPException(status_code=400, detail="Username cannot be empty")
    existing = db.query(models.SystemUser).filter(
        models.SystemUser.username == data.new_username.strip()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    current_user.username = data.new_username.strip()
    db.commit()
    return {"message": "Username changed successfully"}