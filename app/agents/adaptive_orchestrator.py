import os
import sys
import json
import numpy as np
ROOT_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.agents.ingestion_agent import ingestion_agent
from app.agents.clause_agent import clause_agent
from app.agents.risk_agent import risk_agent
from app.agents.insight_agent import insight_agent
from app.agents.communication_agent import communication_agent
from app.agents.department_agent import department_agent

from app.agents.governance_agent import governance_agent
from app.agents.compliance_agent import compliance_agent
from app.agents.executive_agent import executive_agent

from app.memory.memory_agent import memory_agent
from app.memory.contract_memory import save_contract
from app.memory.risk_memory import save_risks

from app.services.workflow_tracker import (
    log_step,
    clear_logs
)

from app.services.history_service import (
    save_contract_history
)

from app.models.contract_feature_extractor import (
    extract_features
)

from app.models.risk_scoring_model import (
    score_contract
)

from app.models.xgboost_risk_model import (
    predict_risk
)

from app.models.explainability import (
    explain_prediction
)


AVAILABLE_AGENTS = {
    "ingestion_agent",
    "clause_agent",
    "risk_agent",
    "insight_agent",
    "communication_agent"
}

def make_json_safe(obj):

    if isinstance(
        obj,
        dict
    ):
        return {
            k: make_json_safe(v)
            for k, v in obj.items()
        }

    elif isinstance(
        obj,
        list
    ):
        return [
            make_json_safe(item)
            for item in obj
        ]

    elif isinstance(
        obj,
        (
            np.float32,
            np.float64
        )
    ):
        return float(obj)

    elif isinstance(
        obj,
        (
            np.int32,
            np.int64
        )
    ):
        return int(obj)

    elif hasattr(
        obj,
        "tolist"
    ):
        return obj.tolist()

    return obj

def adaptive_orchestrator(
    user_query,
    file_path
):

    clear_logs()

    selected_agents = [

        "clause_agent",
        "risk_agent",
        "insight_agent"

    ]

    if (
        "email" in user_query.lower()
        or "notify" in user_query.lower()
        or "communication" in user_query.lower()
    ):

        selected_agents.append(
            "communication_agent"
        )

    print(
        "SELECTED AGENTS:",
        selected_agents
    )

    workflow_data = {

        "agent_state": {

            "workflow_type":
                "Contract Intelligence",

            "rag_enabled":
                True,

            "ml_enabled":
                True,

            "xai_enabled":
                True,

            "governance_enabled":
                True
        }
    }

    # ==================================================
    # INGESTION AGENT
    # ==================================================

    log_step(
        "Ingestion Agent",
        "Started"
    )

    clauses = ingestion_agent(
        file_path
    )

    save_contract(
        file_path,
        clauses
    )

    workflow_data[
        "clauses"
    ] = clauses

    log_step(
        "Ingestion Agent",
        "Completed"
    )

    # ==================================================
    # MEMORY AGENT
    # ==================================================

    workflow_data[
        "memory"
    ] = memory_agent()

    # ==================================================
    # CLAUSE AGENT
    # ==================================================

    log_step(
        "Clause Agent",
        "Started"
    )

    processed_clauses = clause_agent(
        clauses
    )
    
    """workflow_data[
        "processed_clauses"
    ] = processed_clauses

    log_step(
        "Clause Agent",
        "Completed"
    )"""

    # ==================================================
    # FEATURE ENGINEERING
    # ==================================================

    contract_features = extract_features(
        processed_clauses
    )

    from app.models.model_consensus import (
    get_consensus_prediction
    )

    consensus_prediction = (
        get_consensus_prediction(
            contract_features
        )
    )

    workflow_data[
        "model_consensus"
    ] = consensus_prediction

    workflow_data[
            "contract_features"
        ] = contract_features

    # ==================================================
    # XGBOOST RISK PREDICTION
    # ==================================================

    ml_prediction = predict_risk(
        contract_features
    )

    workflow_data[
        "ml_risk_prediction"
    ] = ml_prediction

    workflow_data[
        "agent_state"
    ][
        "ml_enabled"
    ] = (
        ml_prediction.get(
            "model_status"
        ) == "ready"
    )

    # ==================================================
    # EXPLAINABLE AI
    # ==================================================

    xai_result = explain_prediction(
        contract_features
    )

    workflow_data[
        "explainability"
    ] = xai_result

    workflow_data[
        "agent_state"
    ][
        "xai_enabled"
    ] = (
        xai_result.get(
            "model_status"
        ) == "ready"
    )

    # ==================================================
    # DEPARTMENT AGENT
    # ==================================================

    department_results = department_agent(
        processed_clauses
    )

    workflow_data[
        "department_results"
    ] = department_results

    # ==================================================
    # RISK AGENT (RAG ENABLED)
    # ==================================================

    log_step(
        "Risk Agent",
        "Started"
    )

    risks = risk_agent(
        processed_clauses
    )

    save_risks(
        risks
    )

    workflow_data[
        "risks"
    ] = risks

    risk_metrics = score_contract(
        risks
    )

    workflow_data[
        "risk_metrics"
    ] = risk_metrics

    log_step(
        "Risk Agent",
        "Completed"
    )

    # ==================================================
    # GOVERNANCE AGENT
    # ==================================================

    governance_result = governance_agent(

        risks,

        risk_metrics

    )

    workflow_data[
        "governance"
    ] = governance_result

    # ==================================================
    # COMPLIANCE AGENT
    # ==================================================

    compliance_result = compliance_agent(
        processed_clauses
    )

    workflow_data[
        "compliance"
    ] = compliance_result

    # ==================================================
    # INSIGHT AGENT
    # ==================================================

    log_step(
        "Insight Agent",
        "Started"
    )

    insights = insight_agent(

        risks,

        department_results

    )

    workflow_data[
        "insights"
    ] = insights

    log_step(
        "Insight Agent",
        "Completed"
    )

    # ==================================================
    # EXECUTIVE AGENT
    # ==================================================

    executive_summary = executive_agent(

        ml_prediction,

        governance_result,

        compliance_result

    )

    workflow_data[
        "executive_summary"
    ] = executive_summary

    executive_record = {

        "risks":
            risks,

        "departments":
            department_results,

        "insights":
            insights,

        "risk_metrics":
            risk_metrics,

        "governance":
            governance_result,

        "compliance":
            compliance_result

    }

    workflow_data[
        "executive_record"
    ] = executive_record

    # ==================================================
    # COMMUNICATION AGENT
    # ==================================================

    if (
        "communication_agent"
        in selected_agents
    ):

        log_step(
            "Communication Agent",
            "Started"
        )

        communication = communication_agent(
            insights
        )

        workflow_data[
            "communication"
        ] = communication

        log_step(
            "Communication Agent",
            "Completed"
        )

    # ==================================================
    # SAVE CONTRACT HISTORY
    # ==================================================

    try:

        clause_count = len(
            clauses
        )

        risk_count = len(
            risks
        )

        summary = str(
            insights[:1]
        )

        save_contract_history(

            contract_name=file_path,

            clause_count=clause_count,

            risk_count=risk_count,

            executive_summary=summary

        )

        print(
            "CONTRACT HISTORY SAVED"
        )

    except Exception as e:

        print(
            "CONTRACT HISTORY ERROR:",
            str(e)
        )

    # ==================================================
    # RETURN RESPONSE
    # ==================================================
    safe_workflow_data = make_json_safe(
    workflow_data
    )

    print("JSON SERIALIZATION CHECK PASSED")

    return {

        "selected_agents":
            selected_agents,

        "workflow_output":
            safe_workflow_data
    }
