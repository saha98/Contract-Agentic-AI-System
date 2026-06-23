import faiss
import numpy as np
import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.services.embedding_service import generate_embedding

# Vector DB
index = faiss.IndexFlatL2(384)

stored_clauses = []


def add_clause(clause):

    embedding = generate_embedding(clause)

    add_clause_with_embedding(clause, embedding)


def add_clause_with_embedding(clause, embedding):

    vector = np.array([embedding]).astype("float32")

    index.add(vector)

    stored_clauses.append(clause)


def search_clauses(query, top_k=3):
    if index.ntotal == 0 or not stored_clauses:
        return []

    top_k = min(top_k, index.ntotal, len(stored_clauses))

    query_embedding = generate_embedding(query)

    vector = np.array([query_embedding]).astype("float32")

    distances, indices = index.search(vector, top_k)

    results = []

    for idx in indices[0]:
        idx = int(idx)

        if idx < 0 or idx >= len(stored_clauses):
            continue

        results.append(stored_clauses[idx])

    return results
