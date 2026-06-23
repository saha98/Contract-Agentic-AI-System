from sqlalchemy.orm import Session

from app.database.models import (
    Department,
    WorkflowLog
)

from app.database.db import SessionLocal


def escalation_agent(
    company,
    clause,
    risk_level
):

    db = SessionLocal()

    try:

        # Simple routing logic
        if "payment" in clause.lower():

            target_department = "Finance Team"

        else:

            target_department = "Legal Team"

        # Fetch department
        department = db.query(Department).filter(

            Department.company == company,

            Department.department_name == target_department

        ).first()

        if not department:

            return {
                "error": "Department not found"
            }

        # Create workflow log
        workflow = WorkflowLog(

            company=company,

            clause=clause,

            risk_level=risk_level,

            assigned_department=department.department_name,

            assigned_email=department.contact_email,

            status="Escalated"
        )

        db.add(workflow)

        db.commit()

        return {

            "department": department.department_name,

            "contact_person": department.contact_person,

            "assigned_email": department.contact_email,

            "email_status": "Email disabled"
        }

    finally:

        db.close()
