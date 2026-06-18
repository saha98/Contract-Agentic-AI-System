from sqlalchemy.orm import Session

from app.database.models import (
    Department,
    WorkflowLog
)

from app.database.db import SessionLocal

from app.services.email_service import send_email_report


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

        # Send notification email
        try:

            send_email_report(
                department.contact_email,
                "report.pdf"
            )

            email_status = "Notification sent"

        except Exception as e:

            email_status = str(e)

        return {

            "department": department.department_name,

            "contact_person": department.contact_person,

            "assigned_email": department.contact_email,

            "email_status": email_status
        }

    finally:

        db.close()