from fastapi import APIRouter
from app.services.workflow_tracker import get_logs

router = APIRouter()

@router.get("/workflow-logs")
def workflow_logs():

    return {
        "logs": get_logs()
    }