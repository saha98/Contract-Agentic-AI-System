import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.services.pdf_services import (
    extract_text_from_pdf,
    clean_text,
    split_into_clauses
)

def ingestion_agent(file_path):

    # Extract text
    raw_text = extract_text_from_pdf(file_path)

    # Clean text
    cleaned_text = clean_text(raw_text)

    # Split into clauses
    clauses = split_into_clauses(cleaned_text)

    return clauses
