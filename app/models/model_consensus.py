def get_consensus_prediction(
    feature_vector
):

    from app.models.xgboost_risk_model import (
        predict_risk as xgb_predict
    )

    from app.models.random_forest_risk_model import (
        predict_risk as rf_predict
    )

    from app.models.logistic_risk_model import (
        predict_risk as lr_predict
    )

    xgb = xgb_predict(
        feature_vector
    )

    rf = rf_predict(
        feature_vector
    )

    lr = lr_predict(
        feature_vector
    )

    predictions = [

        xgb["risk_class"],

        str(
            rf["prediction"]
        ),

        str(
            lr["prediction"]
        )
    ]

    return {

        "xgboost":
            xgb,

        "random_forest":
            rf,

        "logistic_regression":
            lr,

        "predictions":
            predictions
    }
