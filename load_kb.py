from app.rag.ingest_documents import ingest_folder

ingest_folder(
    "app/knowledge_base/legal"
)

print(
    "\nKnowledge Base Loaded Successfully"
)