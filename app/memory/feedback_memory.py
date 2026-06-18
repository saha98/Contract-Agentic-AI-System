feedback_store = []


def save_feedback(user_query,
                  selected_tool,
                  response,
                  feedback):

    feedback_store.append({

        "query": user_query,

        "tool": selected_tool,

        "response": response,

        "feedback": feedback
    })


def get_feedback_history():

    return feedback_store