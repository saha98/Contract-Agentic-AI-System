from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.escalation_agent import escalation_agent

router = APIRouter()


class EscalationRequest(BaseModel):

    company: str

    clause: str

    risk_level: str


@router.post("/escalate")

def escalate(request: EscalationRequest):

    return escalation_agent(

        request.company,

        request.clause,

        request.risk_level
    )