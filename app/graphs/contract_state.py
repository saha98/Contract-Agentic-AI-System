from typing import TypedDict


class ContractState(TypedDict):

    file_path: str

    clauses: list

    processed_clauses: list

    contract_features: dict

    ml_prediction: dict

    explainability: dict

    risks: list

    risk_metrics: dict

    departments: list

    governance: dict

    compliance: dict

    insights: list

    executive_summary: dict