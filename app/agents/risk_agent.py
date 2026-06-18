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


def risk_agent(processed_clauses):

    if not isinstance(
        processed_clauses,
        list
    ):
        raise ValueError(
            "processed_clauses must be a list."
        )

    risk_results = []

    log_step(
        "Risk Agent",
        "Started"
    )

    for clause in processed_clauses:

        if (
            not isinstance(clause, dict)
            or "text" not in clause
        ):
            continue

        clause_text = clause["text"]

        prompt = f"""
You are an enterprise contract risk analyst.

Analyze the contract clause below.

CONTRACT CLAUSE:
{clause_text}

Return ONLY valid JSON.

Example:

{{
    "risk_level": "Medium",
    "severity": "Moderate",
    "business_impact": "Delayed payments may impact cash flow.",
    "recommended_action": "Negotiate payment period to 30 days.",
    "explanation": "The clause introduces moderate financial exposure."
}}

IMPORTANT RULES:

1. Return ONLY JSON.
2. Do NOT include markdown.
3. Do NOT include explanations outside JSON.
4. Choose ONE value for risk_level:
   High, Medium, Low
5. Choose ONE value for severity:
   Critical, Moderate, Minor
"""

        try:

            response = ask_llm(prompt)

            print("\n========== CLAUSE ==========")
            print(clause_text)

            print("\n========== RAW LLM RESPONSE ==========")
            print(response)
            print("======================================\n")

            cleaned_response = response.strip()

            if cleaned_response.startswith("```"):
                cleaned_response = (
                    cleaned_response
                    .replace("```json", "")
                    .replace("```", "")
                    .strip()
                )

            risk_data = json.loads(
                cleaned_response
            )

            risk_results.append({

                "clause":
                    clause_text,

                "risk_level":
                    risk_data.get(
                        "risk_level",
                        "Medium"
                    ),

                "severity":
                    risk_data.get(
                        "severity",
                        "Moderate"
                    ),

                "business_impact":
                    risk_data.get(
                        "business_impact",
                        "Not Available"
                    ),

                "recommended_action":
                    risk_data.get(
                        "recommended_action",
                        "Review Required"
                    ),

                "analysis":
                    risk_data.get(
                        "explanation",
                        ""
                    )

            })

        except Exception as e:

            print(
                f"Risk Agent Error: {str(e)}"
            )

            risk_results.append({

                "clause":
                    clause_text,

                "risk_level":
                    "Medium",

                "severity":
                    "Moderate",

                "business_impact":
                    "Unable to determine automatically",

                "recommended_action":
                    "Manual review required",

                "analysis":
                    f"LLM parsing error: {str(e)}"

            })

    log_step(
        "Risk Agent",
        "Completed"
    )

    return risk_results