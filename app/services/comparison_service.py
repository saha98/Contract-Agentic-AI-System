from sklearn.metrics.pairwise import cosine_similarity

def compare_clauses(base_clauses, new_clauses, threshold=0.7):
    
    results = []

    for base in base_clauses:
        best_match = None
        best_score = 0

        for new in new_clauses:
            score = cosine_similarity(
                [base["embedding"]],
                [new["embedding"]]
            )[0][0]

            if score > best_score:
                best_score = score
                best_match = new

        # Determine risk
        if best_score < threshold:
            risk = "High"
        elif best_score < 0.85:
            risk = "Medium"
        else:
            risk = "Low"

        results.append({
            "base_clause": base["text"],
            "matched_clause": best_match["text"] if best_match else None,
            "similarity_score": float(best_score),
            "risk_level": risk
        })

    return results