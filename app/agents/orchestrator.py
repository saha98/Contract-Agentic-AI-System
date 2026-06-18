import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.agents.ingestion_agent import ingestion_agent
from app.agents.clause_agent import clause_agent
from app.agents.risk_agent import risk_agent
from app.agents.insight_agent import insight_agent
from app.agents.communication_agent import communication_agent

def orchestrate_contract_workflow(file_path):

    # Step 1: Ingestion
    clauses = ingestion_agent(file_path)

    # Step 2: Clause Intelligence
    processed_clauses = clause_agent(clauses)

    # Step 3: Risk Analysis
    risks = risk_agent(processed_clauses)

    # Step 4: Insight Generation
    insights = insight_agent(risks)

    # Step 5: Communication
    final_output = communication_agent(insights)

    return {
        "insights": insights,
        "delivery": final_output
    }