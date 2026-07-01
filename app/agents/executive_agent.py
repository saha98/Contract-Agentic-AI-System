from app.services.llm_service import (
    ask_llm
)

from app.services.workflow_tracker import (
    log_step
)


def executive_agent(

    risk_metrics,

    governance_result,

    compliance_result

):

    log_step(
        "Executive Agent",
        "Started"
    )

    prompt = f"""
Generate an executive summary.

Risk Metrics:
{risk_metrics}

Governance:
{governance_result}

Compliance:
{compliance_result}

Provide:

1. Executive Summary
2. Key Risks
3. Recommended Actions
4. Escalation Guidance
"""

    summary = ask_llm(
        prompt
    )

    log_step(
        "Executive Agent",
        "Completed"
    )

    return {

        "executive_summary":
            summary
    }