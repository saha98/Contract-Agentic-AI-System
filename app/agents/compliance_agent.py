from app.services.workflow_tracker import log_step


def compliance_agent(
    processed_clauses
):

    log_step(
        "Compliance Agent",
        "Started"
    )

    compliance_checks = {

        "gdpr": False,

        "hipaa": False,

        "sox": False
    }

    full_text = " ".join(

        clause["text"]

        for clause in processed_clauses

        if "text" in clause
    ).lower()

    if (
        "data"
        in full_text
        or
        "privacy"
        in full_text
    ):
        compliance_checks[
            "gdpr"
        ] = True

    if (
        "medical"
        in full_text
        or
        "health"
        in full_text
    ):
        compliance_checks[
            "hipaa"
        ] = True

    if (
        "audit"
        in full_text
        or
        "financial"
        in full_text
    ):
        compliance_checks[
            "sox"
        ] = True

    log_step(
        "Compliance Agent",
        "Completed"
    )

    return compliance_checks