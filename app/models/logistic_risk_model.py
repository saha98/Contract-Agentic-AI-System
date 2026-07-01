import os
import joblib


MODEL_PATH = (
    "models/logistic_risk_model.pkl"
)

DATASET_PATH = (
    "contract_training_dataset.csv"
)


def _unavailable_response(error):

    return {

        "model":
            "LogisticRegression",

        "prediction":
            "Unavailable",

        "probability":
            0.0,

        "model_status":
            "unavailable",

        "model_error":
            str(error)
    }


def train_model():

    import pandas as pd
    from sklearn.linear_model import LogisticRegression

    dataset = pd.read_csv(
        DATASET_PATH
    )

    X = dataset.drop(
        columns=["risk_class"]
    )

    y = dataset[
        "risk_class"
    ]

    model = LogisticRegression(
        max_iter=2000
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

        prediction = int(
            model.predict(df)[0]
        )

        probability = float(
            max(
                model.predict_proba(df)[0]
            )
        )

        return {

            "model":
                "LogisticRegression",

            "prediction":
                prediction,

            "probability":
                round(
                    probability,
                    4
                ),

            "model_status":
                "ready"
        }

    except Exception as error:

        return _unavailable_response(
            error
        )
