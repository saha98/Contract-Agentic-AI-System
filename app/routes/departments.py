from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.database.models import Department

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


class DepartmentRequest(BaseModel):

    company: str

    department_name: str

    contact_person: str

    contact_email: str


@router.post("/departments")

def create_department(
    request: DepartmentRequest,
    db: Session = Depends(get_db)
):

    dept = Department(

        company=request.company,

        department_name=request.department_name,

        contact_person=request.contact_person,

        contact_email=request.contact_email
    )

    db.add(dept)

    db.commit()

    db.refresh(dept)

    return {
        "message": "Department created successfully"
    }


@router.get("/departments/{company}")

def get_departments(
    company: str,
    db: Session = Depends(get_db)
):

    departments = db.query(Department).filter(
        Department.company == company
    ).all()

    return departments