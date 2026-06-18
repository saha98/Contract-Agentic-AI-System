import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
    
from app.tools.tool_registry import TOOLS
from app.services.llm_service import ask_llm


def tool_calling_agent(user_query):

    # Ask LLM which tool to use
    prompt = f"""
    You are an AI orchestration agent.

    Available Tools:
    - search_clauses
    - generate_report
    - send_email
    - llm_reasoning

    User Query:
    {user_query}

    Return ONLY the best tool name.
    """

    selected_tool = ask_llm(prompt).strip()

    # Execute tool
    if selected_tool == "search_clauses":

        result = TOOLS["search_clauses"](user_query)

    elif selected_tool == "llm_reasoning":

        result = TOOLS["llm_reasoning"](user_query)

    else:

        result = f"Tool '{selected_tool}' selected."

    return {
        "selected_tool": selected_tool,
        "result": result
    }