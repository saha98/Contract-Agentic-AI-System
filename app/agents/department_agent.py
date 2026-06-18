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


def department_agent(processed_clauses):

    departments = []

    for clause in processed_clauses:

        text = clause["text"].lower()

        if (
            "payment" in text
            or "invoice" in text
            or "pricing" in text
        ):

            departments.append({
                "department": "Finance",
                "clause": clause["text"]
            })

        elif (
            "confidentiality" in text
            or "data" in text
        ):

            departments.append({
                "department": "Legal",
                "clause": clause["text"]
            })

        elif (
            "termination" in text
            or "liability" in text
        ):

            departments.append({
                "department": "Risk",
                "clause": clause["text"]
            })

    return departments