from fastapi import APIRouter

router = APIRouter()

@router.get("/escalation-dashboard")
def get_escalations():

    return {
        "summary": {
            "high_risk": 5,
            "medium_risk": 8,
            "low_risk": 12
        },

        "escalations": [
            {
                "clause": "Liability Clause",
                "department": "Legal",
                "priority": "High"
            },
            {
                "clause": "Payment Terms",
                "department": "Finance",
                "priority": "Medium"
            },
            {
                "clause": "Data Privacy",
                "department": "Compliance",
                "priority": "High"
            }
        ]
    }