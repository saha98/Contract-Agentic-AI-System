contract_store = []

def save_contract(contract_name, clauses):

    contract_store.append({
        "contract": contract_name,
        "clauses": clauses
    })

def get_contracts():

    return contract_store