import random


def extract_risk_features(
    risks
):

    total_risks = len(
        risks
    )

    high_risks = sum(

        1

        for risk in risks

        if risk.get(
            "risk_level",
            ""
        ).lower() == "high"

    )

    medium_risks = sum(

        1

        for risk in risks

        if risk.get(
            "risk_level",
            ""
        ).lower() == "medium"

    )

    low_risks = sum(

        1

        for risk in risks

        if risk.get(
            "risk_level",
            ""
        ).lower() == "low"

    )

    return {

        "total_risks":
            total_risks,

        "high_risks":
            high_risks,

        "medium_risks":
            medium_risks,

        "low_risks":
            low_risks
    }


def calculate_risk_score(
    risks
):

    features = extract_risk_features(
        risks
    )

    score = (

        features["high_risks"] * 25

        +

        features["medium_risks"] * 10

        +

        features["low_risks"] * 3

    )

    score = min(
        score,
        100
    )

    return score


def calculate_escalation_probability(
    risk_score
):

    probability = min(

        risk_score / 100,

        1.0

    )

    return round(
        probability,
        2
    )


def calculate_contract_health(
    risk_score
):

    health = max(

        100 - risk_score,

        0

    )

    return health


def score_contract(
    risks
):

    risk_score = (
        calculate_risk_score(
            risks
        )
    )

    escalation_probability = (

        calculate_escalation_probability(
            risk_score
        )

    )

    contract_health = (

        calculate_contract_health(
            risk_score
        )

    )

    return {

        "risk_score":
            risk_score,

        "escalation_probability":
            escalation_probability,

        "contract_health":
            contract_health

    }