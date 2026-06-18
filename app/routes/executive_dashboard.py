from fastapi import APIRouter

router = APIRouter()

executive_data = []


@router.post("/executive-dashboard/store")
def store_dashboard_data(data: dict):

    executive_data.append(data)

    return {
        "message": "stored"
    }


@router.get("/executive-dashboard")
def get_dashboard():

    return {
        "records": executive_data
    }