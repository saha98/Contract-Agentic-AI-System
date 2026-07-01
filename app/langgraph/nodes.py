from app.agents.ingestion_agent import (
    ingestion_agent
)

from app.agents.clause_agent import (
    clause_agent
)

from app.agents.risk_agent import (
    risk_agent
)

from app.agents.department_agent import (
    department_agent
)

from app.agents.insight_agent import (
    insight_agent
)


def ingestion_node(
    state
):

    state["clauses"] = ingestion_agent(
        state["file_path"]
    )

    return state


def clause_node(
    state
):

    state["processed_clauses"] = (

        clause_agent(
            state["clauses"]
        )

    )

    return state


def risk_node(
    state
):

    state["risks"] = risk_agent(

        state[
            "processed_clauses"
        ]

    )

    return state