from fastapi import APIRouter
from pydantic import BaseModel
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.services.vector_store import search_clauses
from app.services.llm_service import ask_llm

router = APIRouter()

class ChatRequest(BaseModel):
    query: str


@router.post("/chat")
def chat(request: ChatRequest):

    context = search_clauses(request.query)

    prompt = f"""
    You are a legal AI assistant.

    Relevant Contract Clauses:
    {context}

    User Question:
    {request.query}

    Answer clearly and professionally.
    """

    response = ask_llm(prompt)

    return {
        "query": request.query,
        "retrieved_context": context,
        "response": response
    }
