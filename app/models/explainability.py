def explain_prediction(
    feature_vector
):

    try:

        import pandas as pd
        import shap

        from app.models.xgboost_risk_model import (
            load_model
        )

        model = load_model()

        df = pd.DataFrame(
            [feature_vector]
        )

        explainer = shap.TreeExplainer(
            model
        )

        shap_values = explainer.shap_values(
            df
        )

        feature_importance = []

        for idx, feature_name in enumerate(
            df.columns
        ):

            try:

                value = shap_values

                while hasattr(
                    value,
                    "shape"
                ) and len(
                    value.shape
                ) > 1:

                    value = value[0]

                impact = float(
                    value[idx]
                )

            except Exception:

                impact = 0.0

            feature_importance.append({

                "feature":
                    feature_name,

                "value":
                    float(
                        feature_vector[
                            feature_name
                        ]
                    ),

                "impact":
                    round(
                        impact,
                        4
                    )

            })

        feature_importance.sort(

            key=lambda x:
                abs(
                    x["impact"]
                ),

            reverse=True
        )

        return {

            "top_factors":
                feature_importance[:10],

            "model_status":
                "ready"
        }

    except Exception as error:

        return {

            "top_factors":
                [],

            "model_status":
                "unavailable",

            "model_error":
                str(error)
        }
