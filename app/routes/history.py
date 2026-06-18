from fastapi import APIRouter

from app.services.history_service import (
    get_contract_history
)

router = APIRouter()


@router.get("/contract-history")
def contract_history():

    records = get_contract_history()

    return {

        "history": [

            {
                "contract": r.contract_name,

                "upload_date": r.upload_date,

                "clauses": r.clause_count,

                "risks": r.risk_count,

                "summary": r.executive_summary
            }

            for r in records
        ]
    }