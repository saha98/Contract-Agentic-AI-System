from langgraph.graph import (
    StateGraph,
    END
)

from app.graphs.contract_state import (
    ContractState
)

from app.graphs.nodes import *

workflow = StateGraph(
    ContractState
)

workflow.add_node(
    "Ingestion",
    ingestion_node
)

workflow.add_node(
    "Clause",
    clause_node
)

workflow.add_node(
    "Feature",
    feature_node
)

workflow.add_node(
    "Prediction",
    prediction_node
)

workflow.add_node(
    "XAI",
    xai_node
)

workflow.add_node(
    "Risk",
    risk_node
)

workflow.add_node(
    "Governance",
    governance_node
)

workflow.add_node(
    "Compliance",
    compliance_node
)

workflow.add_node(
    "Department",
    department_node
)

workflow.add_node(
    "Insight",
    insight_node
)

workflow.add_node(
    "Executive",
    executive_node
)

workflow.set_entry_point(
    "Ingestion"
)

workflow.add_edge(
    "Ingestion",
    "Clause"
)

workflow.add_edge(
    "Clause",
    "Feature"
)

workflow.add_edge(
    "Feature",
    "Prediction"
)

workflow.add_edge(
    "Prediction",
    "XAI"
)

workflow.add_edge(
    "XAI",
    "Risk"
)

workflow.add_edge(
    "Risk",
    "Governance"
)

workflow.add_edge(
    "Governance",
    "Compliance"
)

workflow.add_edge(
    "Compliance",
    "Department"
)

workflow.add_edge(
    "Department",
    "Insight"
)

workflow.add_edge(
    "Insight",
    "Executive"
)

workflow.add_edge(
    "Executive",
    END
)

graph = workflow.compile()