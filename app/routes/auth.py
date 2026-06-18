import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.database.models import User

from app.auth.security import (
    hash_password,
    verify_password
)

from app.auth.jwt_handler import (
    create_access_token
)

router = APIRouter()


# Database dependency
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# Signup schema
class SignupRequest(BaseModel):

    name: str

    email: str

    password: str

    role: str

    company: str


# Login schema
class LoginRequest(BaseModel):

    email: str

    password: str


@router.post("/signup")

def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):

    hashed_pw = hash_password(
        request.password
    )

    user = User(
        name=request.name,
        email=request.email,
        role=request.role,
        company=request.company,
        hashed_password=hashed_pw
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return {
        "message": "User created successfully"
    }


@router.post("/login")

def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not user:

        return {
            "error": "Invalid email"
        }

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):

        return {
            "error": "Invalid password"
        }

    token = create_access_token({

        "sub": user.email,

        "role": user.role,

        "company": user.company
    })

    return {

        "access_token": token,

        "token_type": "bearer",

        "role": user.role
    }