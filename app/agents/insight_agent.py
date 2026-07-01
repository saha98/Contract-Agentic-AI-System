import os
import sys
import json

ROOT_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.services.llm_service import ask_llm
from app.services.workflow_tracker import log_step


def insight_agent(
    risk_results,
    department_results
):

    log_step(
        "Insight Agent",
        "Started"
    )

    risk_summary = []

    for index, risk in enumerate(
        risk_results
    ):

        if index < len(
            department_results
        ):

            department = (
                department_results[index]
                .get(
                    "department",
                    "General"
                )
            )

        else:

            department = "General"

        risk_summary.append({

            "clause":
                risk.get(
                    "clause",
                    ""
                ),

            "risk_level":
                risk.get(
                    "risk_level",
                    "Unknown"
                ),

            "severity":
                risk.get(
                    "severity",
                    "Unknown"
                ),

            "department":
                department,

            "business_impact":
                risk.get(
                    "business_impact",
                    ""
                )

        })

    prompt = f"""
You are a senior enterprise contract advisor.

Analyze ALL contract risks together.

Risk Data:

{json.dumps(risk_summary, indent=2)}

Generate:

1. Executive Summary

2. Top 5 Risks

3. Business Impact Assessment

4. Negotiation Recommendations

5. Department Action Items

6. Governance Recommendations

7. Next Steps

Return a professional enterprise report.
"""

    response = ask_llm(
        prompt
    )

    final_insight = {

        "risk_count":
            len(
                risk_results
            ),

        "report":
            response
    }

    log_step(
        "Insight Agent",
        "Completed"
    )

    return [
        final_insight
    ]