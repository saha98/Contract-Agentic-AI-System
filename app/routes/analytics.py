from fastapi import APIRouter

from app.services.analytics_service import (
    calculate_agent_metrics,
    calculate_executive_metrics
)

router = APIRouter()


@router.get("/analytics")
def analytics():

    return {

        "agent_metrics":
            calculate_agent_metrics()
    }


@router.get("/executive-metrics")
def executive_metrics():

    return (
        calculate_executive_metrics()
    )