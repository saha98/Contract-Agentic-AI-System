import shutil
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import APIRouter, UploadFile, File
from app.services.pdf_services import extract_text_from_pdf, clean_text, split_into_clauses
from app.services.clause_service import classify_clause_llm, generate_embedding
from app.services.vector_store import add_clause_with_embedding

router = APIRouter()

UPLOAD_DIR = "data/uploads"

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    raw_text = extract_text_from_pdf(file_path)
    cleaned_text = clean_text(raw_text)
    clauses = split_into_clauses(cleaned_text)

    processed_clauses = []

    for clause in clauses:
        embedding = generate_embedding(clause)

        # Store clause in vector database
        add_clause_with_embedding(clause, embedding)

        processed_clauses.append({
            "text": clause,

            # Dynamic LLM classification
            "category": classify_clause_llm(clause),

            # Semantic embedding
            "embedding": embedding
        })

    return {
        "filename": file.filename,
        "total_clauses": len(processed_clauses),
        "sample_output": processed_clauses[:3]
    }

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
