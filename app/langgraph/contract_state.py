from typing import TypedDict


class ContractState(
    TypedDict,
    total=False
):

    user_query: str

    file_path: str

    clauses: list

    processed_clauses: list

    risks: list

    departments: list

    compliance: dict

    governance: dict

    insights: list

    executive_summary: dict

    communication: dict