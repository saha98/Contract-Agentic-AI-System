from app.memory.feedback_memory import (
    get_feedback_history
)

from app.memory.contract_memory import (
    get_contracts
)

from app.memory.risk_memory import (
    get_risks
)

def memory_agent():

    return {

        "contracts":
            get_contracts(),

        "risks":
            get_risks(),

        "feedback":
            get_feedback_history(),

        "memory_status":
            "active"
    }
