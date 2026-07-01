from app.langgraph.graph_runner import (
    run_graph
)

result = run_graph(

    "Analyze risks",

    "data/contract_variant_1.pdf"

)

print(result.keys())