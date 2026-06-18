import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import APIRouter
from pydantic import BaseModel

from app.agents.conversation_agent import conversation_agent

router = APIRouter()


class ConversationRequest(BaseModel):

    session_id: str

    query: str


@router.post("/conversation")

def conversation(request: ConversationRequest):

    return conversation_agent(
        request.session_id,
        request.query
    )