from app.models.explainability import (
    explain_prediction
)

features = {

    "payment_days": 120,

    "liability_clause": 1,

    "termination_clause": 1,

    "confidentiality_clause": 0,

    "compliance_clause": 0
}

result = explain_prediction(
    features
)

print(result)