from fastapi import APIRouter

router = APIRouter()

@router.get("/agent-monitor")
def get_agent_status():

    return {
        "agents": [
            {
                "name": "Clause Agent",
                "status": "Completed",
                "execution_time": "0.8s"
            },
            {
                "name": "Risk Agent",
                "status": "Completed",
                "execution_time": "1.2s"
            },
            {
                "name": "Department Agent",
                "status": "Completed",
                "execution_time": "0.4s"
            },
            {
                "name": "Escalation Agent",
                "status": "Completed",
                "execution_time": "0.6s"
            },
            {
                "name": "Memory Agent",
                "status": "Completed",
                "execution_time": "0.3s"
            }
        ]
    }