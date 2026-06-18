from fastapi import APIRouter

router = APIRouter()

@router.get("/department-dashboard")
def get_departments():

    return {
        "departments": [
            {
                "name": "Legal",
                "open_cases": 5,
                "status": "Active"
            },
            {
                "name": "Compliance",
                "open_cases": 3,
                "status": "Active"
            },
            {
                "name": "Finance",
                "open_cases": 2,
                "status": "Active"
            },
            {
                "name": "Procurement",
                "open_cases": 4,
                "status": "Active"
            }
        ]
    }