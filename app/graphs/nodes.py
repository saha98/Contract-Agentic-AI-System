from app.agents.ingestion_agent import ingestion_agent
from app.agents.clause_agent import clause_agent
from app.agents.risk_agent import risk_agent
from app.agents.department_agent import department_agent
from app.agents.insight_agent import insight_agent

from app.agents.governance_agent import governance_agent
from app.agents.compliance_agent import compliance_agent
from app.agents.executive_agent import executive_agent

from app.models.contract_feature_extractor import (
    extract_features
)

from app.models.xgboost_risk_model import (
    predict_risk
)

from app.models.explainability import (
    explain_prediction
)

from app.models.risk_scoring_model import (
    score_contract
)


def ingestion_node(state):

    state["clauses"] = ingestion_agent(
        state["file_path"]
    )

    return state


def clause_node(state):

    state["processed_clauses"] = clause_agent(
        state["clauses"]
    )

    return state


def feature_node(state):

    features = extract_features(
        state["processed_clauses"]
    )

    state["contract_features"] = (
        features
    )

    return state


def prediction_node(state):

    prediction = predict_risk(
        state["contract_features"]
    )

    state["ml_prediction"] = (
        prediction
    )

    return state


def xai_node(state):

    state["explainability"] = (
        explain_prediction(
            state["contract_features"]
        )
    )

    return state


def risk_node(state):

    risks = risk_agent(
        state["processed_clauses"]
    )

    state["risks"] = risks

    state["risk_metrics"] = (
        score_contract(
            risks
        )
    )

    return state


def governance_node(state):

    state["governance"] = (
        governance_agent(

            state["risks"],

            state["ml_prediction"]
        )
    )

    return state


def compliance_node(state):

    state["compliance"] = (
        compliance_agent(
            state["processed_clauses"]
        )
    )

    return state


def department_node(state):

    state["departments"] = (
        department_agent(
            state["processed_clauses"]
        )
    )

    return state


def insight_node(state):

    state["insights"] = (
        insight_agent(

            state["risks"],

            state["departments"]
        )
    )

    return state


def executive_node(state):

    state["executive_summary"] = (
        executive_agent(

            state["ml_prediction"],

            state["governance"],

            state["compliance"]
        )
    )

    return state