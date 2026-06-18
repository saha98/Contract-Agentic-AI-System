from datetime import datetime

from app.database.db import SessionLocal

from app.database.models import (
    ContractHistory
)


def save_contract_history(
    contract_name,
    clause_count,
    risk_count,
    executive_summary
):

    db = SessionLocal()

    try:

        record = ContractHistory(

            contract_name=contract_name,

            upload_date=str(
                datetime.now()
            ),

            clause_count=clause_count,

            risk_count=risk_count,

            executive_summary=executive_summary
        )

        db.add(record)

        db.commit()

    finally:

        db.close()


def get_contract_history():

    db = SessionLocal()

    try:

        records = db.query(
            ContractHistory
        ).all()

        return records

    finally:

        db.close()