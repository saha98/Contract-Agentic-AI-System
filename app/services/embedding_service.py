from functools import lru_cache


@lru_cache(maxsize=1)
def get_embedding_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer("all-MiniLM-L6-v2")


def generate_embedding(text):
    embedding = get_embedding_model().encode(text)
    return embedding.tolist()
