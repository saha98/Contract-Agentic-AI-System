from app.services.vector_store import add_clause, search_clauses

# Add clauses
add_clause("Payment must be completed within 30 days.")
add_clause("The agreement may be terminated with notice.")
add_clause("All confidential information must remain private.")

# Search
results = search_clauses("How does payment work?")

print(results)