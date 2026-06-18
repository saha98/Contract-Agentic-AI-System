import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.memory.feedback_memory import (
    save_feedback,
    get_feedback_history
)

def feedback_agent(query,
                   tool,
                   response,
                   feedback):

    save_feedback(
        query,
        tool,
        response,
        feedback
    )

    return {
        "status": "Feedback stored successfully"
    }


def retrieve_feedback_history():

    return get_feedback_history()