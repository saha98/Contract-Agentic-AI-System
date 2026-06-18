import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.memory.session_memory import (
    save_conversation,
    get_conversation_history
)

from app.services.vector_store import search_clauses
from app.services.llm_service import ask_llm


def conversation_agent(session_id,
                       query):

    # Retrieve previous history
    history = get_conversation_history(session_id)

    # Retrieve relevant clauses
    context = search_clauses(query)

    # Build conversational prompt
    prompt = f"""
    You are an enterprise legal AI assistant.

    Previous Conversation:
    {history}

    Relevant Contract Context:
    {context}

    Current User Query:
    {query}

    Answer professionally and contextually.
    """

    response = ask_llm(prompt)

    # Save conversation
    save_conversation(
        session_id,
        query,
        response
    )

    return {
        "response": response,
        "history": history
    }