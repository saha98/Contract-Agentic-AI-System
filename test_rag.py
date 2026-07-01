from app.rag.retriever import retrieve_context

result = retrieve_context(
    "Payment due within 120 days"
)

print(result)