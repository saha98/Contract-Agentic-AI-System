import os
import sys

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

AVAILABLE_AGENTS = {
    "ingestion_agent",
    "clause_agent",
    "risk_agent",
    "insight_agent",
    "communication_agent",
}


def adaptive_orchestrator(
    user_query,
    file_path
):

    clear_logs()

    # ==================================================
    # ENTERPRISE WORKFLOW SELECTION
    # ==================================================

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

    workflow_data = {}

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

    log_step(
        "Ingestion Agent",
        "Completed"
    )

    workflow_data["clauses"] = clauses

    # ==================================================
    # MEMORY AGENT
    # ==================================================

    memory_context = memory_agent()

    workflow_data["memory"] = memory_context

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

    department_results = department_agent(
        processed_clauses
    )

    workflow_data[
        "department_results"
    ] = department_results

    workflow_data[
        "processed_clauses"
    ] = processed_clauses

    log_step(
        "Clause Agent",
        "Completed"
    )

    # ==================================================
    # RISK AGENT
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

    log_step(
        "Risk Agent",
        "Completed"
    )

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

    executive_record = {

        "risks":
            risks,

        "departments":
            department_results,

        "insights":
            insights
    }

    workflow_data[
        "executive_record"
    ] = executive_record

    log_step(
        "Insight Agent",
        "Completed"
    )

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
            workflow_data.get(
                "clauses",
                []
            )
        )

        risk_count = len(
            workflow_data.get(
                "risks",
                []
            )
        )

        summary = str(
            insights[:1]
        )

        print(
            "SAVING CONTRACT HISTORY..."
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

    return {

        "selected_agents":
            selected_agents,

        "workflow_output":
            workflow_data
    }