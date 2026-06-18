from fastapi import APIRouter, UploadFile, File
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
from app.services.email_service import send_email_report

router = APIRouter()

UPLOAD_DIR = "data/uploads"

def process_file(file_path):
    raw_text = extract_text_from_pdf(file_path)
    cleaned_text = clean_text(raw_text)
    clauses = split_into_clauses(cleaned_text)

    processed = []
    for clause in clauses:
        processed.append({
            "text": clause,
            "category": classify_clause(clause),
            "embedding": generate_embedding(clause)
        })

    return processed


@router.post("/compare")
async def compare(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...)
):
    return await compare_files(file1, file2)

async def compare_files(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    
    path1 = os.path.join(UPLOAD_DIR, file1.filename)
    path2 = os.path.join(UPLOAD_DIR, file2.filename)

    with open(path1, "wb") as f:
        shutil.copyfileobj(file1.file, f)

    with open(path2, "wb") as f:
        shutil.copyfileobj(file2.file, f)

    clauses1 = process_file(path1)
    clauses2 = process_file(path2)

    # results = compare_clauses(clauses1, clauses2)

    # return {
    #     "total_comparisons": len(results),
    #     "sample_results": results[:5]
    # }

    results = compare_clauses(clauses1, clauses2)

    insights = generate_insights(results)

    report_path = generate_report(insights)

    # send_email_report("saha0709suvodeep@gmail.com", report_path)

    # return {
    #     "total_issues": len(insights),
    #     "report_generated": report_path,
    #     "sample_insights": insights[:5]
    # }

    # return {
    #     "total_issues": len(insights),
    #     "report_generated": report_path,
    #     "email_status": "Report sent successfully"
    # }

    report_path = generate_report(insights)

    #Safe email handling
    try:
        send_email_report("saha0709suvodeep@gmail.com", report_path)
        email_status = "Email sent successfully"
    except Exception as e:
        email_status = str(e)

    return {
        "total_issues": len(insights),
        "report_generated": report_path,
        "email_status": email_status
    }