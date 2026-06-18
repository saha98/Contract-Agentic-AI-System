from fastapi import APIRouter

from app.memory.contract_memory import (
    get_contracts
)

from app.memory.risk_memory import (
    get_risks
)

from app.memory.feedback_memory import (
    get_feedback_history
)

router = APIRouter()

@router.get("/memory")

def memory():

    return {

        "contracts":
            get_contracts(),

        "risks":
            get_risks(),

        "feedback":
            get_feedback_history()
    }