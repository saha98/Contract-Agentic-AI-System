import os
from dotenv import load_dotenv
from openai import APIConnectionError, OpenAI, OpenAIError, RateLimitError

# Load environment variables
load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

# Ollama exposes an OpenAI-compatible local API. The API key is ignored by
# Ollama, but the OpenAI SDK still requires a non-empty value.
client = OpenAI(base_url=OLLAMA_BASE_URL, api_key="ollama")


def ask_llm(prompt):
    try:
        response = client.chat.completions.create(
            model=OLLAMA_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": "You are a legal AI assistant specializing in contract analysis."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        return response.choices[0].message.content
    except APIConnectionError as e:
        raise RuntimeError(
            "LLM request failed because Ollama could not be reached. "
            "Start Ollama and make sure it is running at "
            f"{OLLAMA_BASE_URL.replace('/v1', '')}."
        ) from e
    except RateLimitError as e:
        raise RuntimeError(
            "LLM request was rate-limited by the local Ollama API."
        ) from e
    except OpenAIError as e:
        raise RuntimeError(
            "LLM request failed. Check that the Ollama model is downloaded. "
            f"Try: ollama pull {OLLAMA_MODEL}"
        ) from e
