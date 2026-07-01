import os
import uuid

from app.rag.vector_store import (
    get_collection
)

from app.rag.embeddings import (
    generate_embedding
)


def ingest_document(
    text,
    source
):

    collection = get_collection()

    embedding = generate_embedding(
        text
    )

    collection.add(

        ids=[
            str(uuid.uuid4())
        ],

        documents=[
            text
        ],

        embeddings=[
            embedding
        ],

        metadatas=[
            {
                "source": source
            }
        ]
    )


def ingest_folder(folder_path):

    if not os.path.exists(
        folder_path
    ):
        print(
            f"Folder not found: {folder_path}"
        )
        return

    for file_name in os.listdir(
        folder_path
    ):

        file_path = os.path.join(
            folder_path,
            file_name
        )

        if os.path.isfile(
            file_path
        ):

            try:

                with open(
                    file_path,
                    "r",
                    encoding="utf-8"
                ) as file:

                    text = file.read()

                    ingest_document(
                        text,
                        file_name
                    )

                    print(
                        f"Indexed: {file_name}"
                    )

            except Exception as e:

                print(
                    f"Error indexing {file_name}: {e}"
                )