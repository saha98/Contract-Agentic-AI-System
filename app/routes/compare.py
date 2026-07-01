from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse
import shutil
import os
import sys

# Add project root to sys.path for imports
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.services.pdf_services import extract_text_from_pdf, clean_text, split_into_clauses
from app.services.clause_service import classify_clause, generate_embedding
from app.services.comparison_service import compare_clauses
from app.services.insight_service import generate_insights
from app.services.report_service import generate_report
from app.services.vector_store import add_clause_with_embedding

router = APIRouter()

UPLOAD_DIR = "data/uploads"
REPORT_DIR = "data"


def sanitize_filename(name):
    base_name = os.path.splitext(
        os.path.basename(name)
    )[0]

    sanitized = "".join(
        character
        if (
            character.isalnum()
            or character in {"-", "_"}
        )
        else "_"
        for character in base_name
    ).strip("_")

    return sanitized or "contract"

def process_file(file_path):
    raw_text = extract_text_from_pdf(file_path)
    cleaned_text = clean_text(raw_text)
    clauses = split_into_clauses(cleaned_text)

    processed = []
    for clause in clauses:
        embedding = generate_embedding(clause)
        add_clause_with_embedding(clause, embedding)

        processed.append({
            "text": clause,
            "category": classify_clause(clause),
            "embedding": embedding
        })

    return processed


@router.post("/compare")
async def compare(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    return await compare_files(file1, file2)


@router.get("/compare-report")
def download_compare_report(
    path: str = Query(...)
):
    data_dir = Path(REPORT_DIR).resolve()
    requested_path = Path(path).resolve()

    if not str(requested_path).startswith(
        str(data_dir)
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid report path."
        )

    if not requested_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Report not found."
        )

    return FileResponse(
        requested_path,
        media_type="application/pdf",
        filename=requested_path.name
    )

async def compare_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    path1 = os.path.join(UPLOAD_DIR, file1.filename)
    path2 = os.path.join(UPLOAD_DIR, file2.filename)

    with open(path1, "wb") as f:
        shutil.copyfileobj(file1.file, f)

    with open(path2, "wb") as f:
        shutil.copyfileobj(file2.file, f)

    clauses1 = process_file(path1)
    clauses2 = process_file(path2)

    results = compare_clauses(clauses1, clauses2)

    insights = generate_insights(results)

    report_filename = (
        "comparison_"
        f"{sanitize_filename(file1.filename)}"
        "_vs_"
        f"{sanitize_filename(file2.filename)}"
        f"_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    )

    report_path = generate_report(
        insights,
        filename=report_filename
    )

    risk_breakdown = {
        "high": sum(
            1
            for item in insights
            if item["risk_level"] == "High"
        ),
        "medium": sum(
            1
            for item in insights
            if item["risk_level"] == "Medium"
        ),
        "low": sum(
            1
            for item in insights
            if item["risk_level"] == "Low"
        )
    }

    return {
        "total_issues": len(insights),
        "report_generated": report_path,
        "report_filename": report_filename,
        "risk_breakdown": risk_breakdown,
        "insights": insights[:8],
        "contracts": {
            "primary_clauses": len(clauses1),
            "comparison_clauses": len(clauses2)
        }
    }
