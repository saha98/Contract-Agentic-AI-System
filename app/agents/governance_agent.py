from app.services.workflow_tracker import log_step


def governance_agent(
    risks,
    risk_metrics
):

    log_step(
        "Governance Agent",
        "Started"
    )

    governance_score = max(

        100 -

        risk_metrics.get(
            "risk_score",
            0
        ),

        0
    )

    escalation_required = (

        risk_metrics.get(
            "risk_score",
            0
        ) > 70

    )

    governance_result = {

        "governance_score":
            governance_score,

        "escalation_required":
            escalation_required,

        "review_level":

            "Executive"

            if escalation_required

            else "Standard"

    }

    log_step(
        "Governance Agent",
        "Completed"
    )

    return governance_result