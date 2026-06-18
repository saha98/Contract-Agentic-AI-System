import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import APIRouter, UploadFile, File, Form
import shutil
from fastapi import Depends

from app.auth.dependencies import require_role
from app.agents.adaptive_orchestrator import adaptive_orchestrator

router = APIRouter()


@router.post("/adaptive-workflow")


def adaptive_workflow(

    query: str = Form(...),

    file: UploadFile = File(...)
):

    file_path = f"data/{file.filename}"

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(file.file, buffer)

    result = adaptive_orchestrator(
        query,
        file_path
    )

    return result
