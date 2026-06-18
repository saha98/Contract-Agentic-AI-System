import os
import sys

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

    final_insights = []

    log_step(
        "Insight Agent",
        "Started"
    )

    for index, risk in enumerate(
        risk_results
    ):

        # Safe department lookup

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

        prompt = f"""
Based on the following information:

Risk Analysis:
{risk.get('analysis', '')}

Risk Level:
{risk.get('risk_level', 'Unknown')}

Severity:
{risk.get('severity', 'Unknown')}

Business Impact:
{risk.get('business_impact', 'Unknown')}

Responsible Department:
{department}

Generate:

1. Executive Summary

2. Business Impact Assessment

3. Risk Recommendation

4. Negotiation Advice

5. Department Action Items

6. Next Steps
"""

        response = ask_llm(
            prompt
        )

        final_insights.append({

            "clause":
                risk.get(
                    "clause",
                    ""
                ),

            "department":
                department,

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

            "insight":
                response

        })

    log_step(
        "Insight Agent",
        "Completed"
    )

    return final_insights