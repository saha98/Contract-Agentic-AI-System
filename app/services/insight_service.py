def generate_insights(comparison_results):
    
    insights = []

    for item in comparison_results:
        
        score = item["similarity_score"]
        risk = item["risk_level"]

        # Explain WHY
        if score < 0.7:
            reason = "Low semantic similarity between clauses"
        elif score < 0.85:
            reason = "Moderate variation in clause wording"
        else:
            reason = "High similarity with minor wording differences"

        # Recommendation logic
        if risk == "High":
            recommendation = "Immediate legal escalation required"
        elif risk == "Medium":
            recommendation = "Review and renegotiate terms"
        else:
            recommendation = "No action required"

        insights.append({
            "issue": item["base_clause"],
            "matched_with": item["matched_clause"],
            "similarity_score": round(score, 2),
            "risk_level": risk,
            "reason": reason,
            "recommendation": recommendation
        })

    return insights