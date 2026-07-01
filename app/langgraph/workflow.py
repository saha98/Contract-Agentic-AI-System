from langgraph.graph import (
    StateGraph,
    END
)

from app.langgraph.contract_state import (
    ContractState
)

from app.langgraph.nodes import (

    ingestion_node,

    clause_node,

    risk_node

)


def build_graph():

    workflow = StateGraph(
        ContractState
    )

    workflow.add_node(
        "ingestion",
        ingestion_node
    )

    workflow.add_node(
        "clause",
        clause_node
    )

    workflow.add_node(
        "risk",
        risk_node
    )

    workflow.set_entry_point(
        "ingestion"
    )

    workflow.add_edge(
        "ingestion",
        "clause"
    )

    workflow.add_edge(
        "clause",
        "risk"
    )

    workflow.add_edge(
        "risk",
        END
    )

    return workflow.compile()