import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.services.vector_store import search_clauses
from app.services.report_service import generate_report
from app.services.email_service import send_email_report
from app.services.llm_service import ask_llm


TOOLS = {

    "search_clauses": search_clauses,

    "generate_report": generate_report,

    "send_email": send_email_report,

    "llm_reasoning": ask_llm
}