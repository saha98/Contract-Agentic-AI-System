from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.database.models import WorkflowLog

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/audit-logs")

def get_logs(
    db: Session = Depends(get_db)
):

    logs = db.query(WorkflowLog).all()

    return logs