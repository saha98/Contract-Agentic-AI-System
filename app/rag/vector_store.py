try:
    import chromadb
except ModuleNotFoundError as exc:
    chromadb = None
    _chromadb_import_error = exc
else:
    _chromadb_import_error = None

client = None
collection = None


def _get_or_create_collection():

    global client
    global collection

    if chromadb is None:
        raise RuntimeError(
            "chromadb is required for the RAG knowledge base. "
            "Install dependencies from requirements.txt in the active interpreter."
        ) from _chromadb_import_error

    if collection is None:
        client = chromadb.PersistentClient(
            path="vector_db"
        )

        collection = client.get_or_create_collection(
            name="contract_knowledge_base"
        )

    return collection


def get_collection():

    return _get_or_create_collection()
