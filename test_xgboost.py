from app.models.xgboost_risk_model import (
    predict_risk
)

feature_vector = {

    "payment_days": 120,

    "liability_clause": 1,

    "termination_clause": 1,

    "confidentiality_clause": 0,

    "compliance_clause": 0
}

result = predict_risk(
    feature_vector
)

print(result)