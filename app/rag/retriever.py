from app.rag.vector_store import (
    get_collection
)

from app.rag.embeddings import (
    generate_embedding
)


def retrieve_context(
    query,
    n_results=3
):

    collection = get_collection()

    query_embedding = generate_embedding(
        query
    )

    results = collection.query(

        query_embeddings=[
            query_embedding
        ],

        n_results=n_results
    )

    print("\n")
    print("====================================")
    print("RAG QUERY")
    print(query)

    print("\nRAG RESULTS")

    if (
        "documents" in results
        and results["documents"]
    ):
        print(
            results["documents"][0]
        )
    else:
        print("NO DOCUMENTS FOUND")

    print("====================================")
    print("\n")

    documents = []

    if (
        "documents" in results
        and results["documents"]
    ):

        documents = (
            results["documents"][0]
        )

    return "\n\n".join(
        documents
    )