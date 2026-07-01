def route_workflow(
    state
):

    query = state[
        "user_query"
    ].lower()

    if (
        "gdpr" in query
        or
        "compliance" in query
    ):
        return "compliance"

    if (
        "executive" in query
        or
        "summary" in query
    ):
        return "executive"

    return "risk"