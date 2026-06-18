import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import APIRouter
from pydantic import BaseModel
from fastapi import Depends

from app.auth.dependencies import require_role
from app.agents.feedback_agent import (
    feedback_agent,
    retrieve_feedback_history
)

router = APIRouter()


class FeedbackRequest(BaseModel):

    query: str

    tool: str

    response: str

    feedback: str


@router.post("/feedback")

def submit_feedback(request: FeedbackRequest):

    return feedback_agent(
        request.query,
        request.tool,
        request.response,
        request.feedback
    )


@router.get("/feedback/history")
def feedback_history(

    user=Depends(
        require_role(["admin"])
    )
):

    return retrieve_feedback_history()