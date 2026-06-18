session_store = {}


def save_conversation(session_id,
                      user_query,
                      ai_response):

    if session_id not in session_store:

        session_store[session_id] = []

    session_store[session_id].append({

        "query": user_query,

        "response": ai_response
    })


def get_conversation_history(session_id):

    return session_store.get(session_id, [])