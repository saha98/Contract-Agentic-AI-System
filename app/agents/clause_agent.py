import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.services.vector_store import add_clause
from app.services.clause_service import classify_clause_llm
from app.services.embedding_service import generate_embedding
from app.services.workflow_tracker import log_step

def clause_agent(clauses):

    processed_clauses = []

    for clause in clauses:

        # Generate category
        category = classify_clause_llm(clause)

        # Generate embedding
        embedding = generate_embedding(clause)

        # Store in vector DB
        add_clause(clause)

        processed_clauses.append({
            "text": clause,
            "category": category,
            "embedding": embedding
        })

    return processed_clauses