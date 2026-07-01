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

from app.rag.retriever import retrieve_context


def risk_agent(processed_clauses):

    log_step(
        "Risk Agent",
        "Started"
    )

    risks = []

    for clause in processed_clauses:

        if (
            not isinstance(clause, dict)
            or "text" not in clause
        ):
            continue

        clause_text = clause["text"]

        try:

            rag_context = retrieve_context(
                clause_text,
                n_results=1
            )

            print("\n==========================")
            print("CLAUSE")
            print(clause_text)

            print("\nRAG CONTEXT")
            print(rag_context)
            print("==========================\n")

            prompt = f"""
You are a senior enterprise contract risk analyst.

Analyze ONLY the contract clause below.

================================================

CONTRACT CLAUSE

{clause_text}

================================================

REFERENCE MATERIAL

{rag_context}

================================================

IMPORTANT RULES

1. Analyze ONLY the clause provided.
2. Do NOT invent clauses.
3. Do NOT assume missing clauses exist.
4. Use reference material only as guidance.
5. If the clause is acceptable, classify it as Low Risk.

Return ONLY valid JSON.

Format:

{{
    "risk_level":"Low | Medium | High",
    "severity":"Minor | Moderate | Critical",
    "business_impact":"...",
    "recommended_action":"...",
    "explanation":"..."
}}
"""

            response = ask_llm(
                prompt
            )

            print("\n========== RAW LLM ==========")
            print(response)
            print("=============================\n")

            cleaned = (
                response
                .replace(
                    "```json",
                    ""
                )
                .replace(
                    "```",
                    ""
                )
                .strip()
            )

            risk_data = json.loads(
                cleaned
            )

            risks.append({

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
                        ""
                    ),

                "recommended_action":
                    risk_data.get(
                        "recommended_action",
                        ""
                    ),

                "analysis":
                    risk_data.get(
                        "explanation",
                        ""
                    )

            })

        except Exception as e:

            print(
                "Risk Agent Error:",
                str(e)
            )

            risks.append({

                "clause":
                    clause_text,

                "risk_level":
                    "Medium",

                "severity":
                    "Moderate",

                "business_impact":
                    "Unable to analyze clause",

                "recommended_action":
                    "Manual review required",

                "analysis":
                    str(e)

            })

    log_step(
        "Risk Agent",
        "Completed"
    )

    return risks