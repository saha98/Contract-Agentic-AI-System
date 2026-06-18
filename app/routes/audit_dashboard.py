from fastapi import APIRouter

router = APIRouter()

@router.get("/audit-dashboard")
def get_audit_logs():

    return {
        "logs": [
            {
                "timestamp": "2026-06-08 10:05",
                "user": "Admin",
                "action": "Uploaded Contract",
                "status": "Success"
            },
            {
                "timestamp": "2026-06-08 10:12",
                "user": "Admin",
                "action": "Compared Contracts",
                "status": "Success"
            },
            {
                "timestamp": "2026-06-08 10:18",
                "user": "Admin",
                "action": "AI Query Executed",
                "status": "Success"
            },
            {
                "timestamp": "2026-06-08 10:25",
                "user": "Admin",
                "action": "Escalation Generated",
                "status": "Success"
            }
        ]
    }