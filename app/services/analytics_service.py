from collections import defaultdict

from app.services.workflow_tracker import get_logs
from app.services.history_service import (
    get_contract_history
)


def calculate_agent_metrics():

    logs = get_logs()

    metrics = defaultdict(
        lambda: {
            "runs": 0,
            "runtime_total": 0
        }
    )

    for log in logs:

        if (
            log["status"] == "Completed"
            and log.get("runtime") is not None
        ):

            metrics[
                log["agent"]
            ]["runs"] += 1

            metrics[
                log["agent"]
            ]["runtime_total"] += (
                log["runtime"]
            )

    result = []

    for agent, data in metrics.items():

        avg_runtime = (
            data["runtime_total"]
            / data["runs"]
        )

        result.append({

            "agent": agent,

            "runs": data["runs"],

            "avg_runtime": round(
                avg_runtime,
                2
            )
        })

    return result


def calculate_executive_metrics():

    contracts = get_contract_history()

    total_contracts = len(
        contracts
    )

    total_risks = sum(

        contract.risk_count or 0

        for contract in contracts
    )

    total_clauses = sum(

        contract.clause_count or 0

        for contract in contracts
    )

    avg_clauses = (

        round(
            total_clauses /
            total_contracts,
            2
        )

        if total_contracts > 0

        else 0
    )

    high_risk_contracts = len(

        [

            contract

            for contract in contracts

            if (
                contract.risk_count or 0
            ) >= 5

        ]
    )

    agent_runs = sum(

        metric["runs"]

        for metric in
        calculate_agent_metrics()

    )

    return {

        "contracts":
            total_contracts,

        "total_risks":
            total_risks,

        "avg_clauses":
            avg_clauses,

        "high_risk_contracts":
            high_risk_contracts,

        "departments":
            4,

        "agent_runs":
            agent_runs
    }