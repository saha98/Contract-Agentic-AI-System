from app.database.db import SessionLocal
from app.database.models import RiskHistory


def save_risk_history(
    contract_name,
    clause,
    risk_level,
    assigned_department
):

    db = SessionLocal()

    try:

        record = RiskHistory(

            contract_name=contract_name,

            clause=clause,

            risk_level=risk_level,

            assigned_department=
                assigned_department
        )

        db.add(record)

        db.commit()

    finally:

        db.close()


def get_risk_history():

    db = SessionLocal()

    try:

        return db.query(
            RiskHistory
        ).all()

    finally:

        db.close()