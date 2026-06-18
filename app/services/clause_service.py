import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from sentence_transformers import SentenceTransformer
from app.services.llm_service import ask_llm

# This service provides functions to classify clauses and generate embeddings for them.
def classify_clause(clause):
    
    clause = clause.lower()

    if "payment" in clause or "fee" in clause:
        return "Payment"
    elif "terminate" in clause or "termination" in clause:
        return "Termination"
    elif "liability" in clause or "damage" in clause:
        return "Liability"
    elif "confidential" in clause:
        return "Confidentiality"
    else:
        return "General"


def classify_clause_llm(clause):
    prompt = f"""
Classify the contract clause into exactly one of these categories:
Payment, Termination, Liability, Confidentiality, General.

Return only the category name.

Clause:
{clause}
"""

    try:
        category = ask_llm(prompt).strip()
    except RuntimeError:
        return classify_clause(clause)

    valid_categories = {
        "Payment",
        "Termination",
        "Liability",
        "Confidentiality",
        "General",
    }

    for valid_category in valid_categories:
        if valid_category.lower() in category.lower():
            return valid_category

    return classify_clause(clause)


# Global model variable - loaded lazily
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            raise RuntimeError(f"Failed to load sentence transformer model: {e}")
    return _model

# This function generates an embedding for a given clause using the SentenceTransformer model. It encodes the clause into a vector representation and returns it as a list. This embedding can be used for various downstream tasks such as similarity comparison, clustering, or feeding into machine learning models for further analysis.
def generate_embedding(clause):
    model = get_model()
    return model.encode(clause).tolist()


if __name__ == "__main__":
    sample_clause = "Payment must be completed within 30 days."
    print(classify_clause(sample_clause))
