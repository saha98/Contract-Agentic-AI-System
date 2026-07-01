import os
import joblib


MODEL_PATH = (
    "models/xgboost_risk_model.pkl"
)

DATASET_PATH = (
    "contract_training_dataset.csv"
)


def _unavailable_response(error):

    return {

        "risk_class":
            "Unavailable",

        "risk_score":
            0.0,

        "escalation_probability":
            0.0,

        "model_status":
            "unavailable",

        "model_error":
            str(error)
    }


def train_model():

    import pandas as pd
    from xgboost import XGBClassifier

    if not os.path.exists(
        DATASET_PATH
    ):
        raise FileNotFoundError(
            "contract_training_dataset.csv not found. "
            "Run generate_training_data.py first."
        )

    dataset = pd.read_csv(
        DATASET_PATH
    )

    X = dataset.drop(
        columns=["risk_class"]
    )

    y = dataset[
        "risk_class"
    ]

    model = XGBClassifier(

        n_estimators=300,

        max_depth=6,

        learning_rate=0.05,

        subsample=0.8,

        colsample_bytree=0.8,

        random_state=42
    )

    model.fit(
        X,
        y
    )

    os.makedirs(
        "models",
        exist_ok=True
    )

    joblib.dump(
        model,
        MODEL_PATH
    )

    print(
        "XGBoost model trained successfully."
    )

    return model


def load_model():

    if not os.path.exists(
        MODEL_PATH
    ):

        return train_model()

    return joblib.load(
        MODEL_PATH
    )


def predict_risk(
    feature_vector
):

    try:

        import pandas as pd

        model = load_model()

        df = pd.DataFrame(
            [feature_vector]
        )

        probability = float(

            model.predict_proba(
                df
            )[0][1]

        )

        prediction = int(

            model.predict(
                df
            )[0]

        )

        risk_mapping = {

            0: "Low",

            1: "Medium",

            2: "High",

            3: "Critical"

        }

        risk_class = risk_mapping.get(
            prediction,
            "Medium"
    )

        risk_score = round(
            probability * 100,
            2
        )

        return {

            "risk_class":
                str(risk_class),

            "risk_score":
                float(risk_score),

            "escalation_probability":
                float(
                    round(
                        probability,
                        2
                    )
                ),

            "model_status":
                "ready"
        }

    except Exception as error:

        return _unavailable_response(
            error
        )
