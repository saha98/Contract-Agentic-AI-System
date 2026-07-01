import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

DEFAULT_APP_HOST = os.getenv("APP_HOST", "127.0.0.1")
DEFAULT_APP_PORT = int(os.getenv("APP_PORT", "8000"))


def _build_cors_origins() -> list[str]:
    origins = {
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    }
    extra_origins = os.getenv("CORS_ALLOW_ORIGINS", "")
    origins.update(
        origin.strip()
        for origin in extra_origins.split(",")
        if origin.strip()
    )
    return sorted(origins)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import uploads, compare, chat, feedback, conversation, adaptive, auth, departments, escalation, audit_logs, agent_monitor, escalation_dashboard, audit_dashboard, department_dashboard, workflow_logs, memory, analytics
from app.routes import executive_dashboard
from app.routes import history

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=_build_cors_origins(),
    # Allow any localhost Vite port during development.
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploads.router)
app.include_router(compare.router)
app.include_router(chat.router)
app.include_router(feedback.router)
app.include_router(conversation.router)
app.include_router(adaptive.router)
app.include_router(auth.router)
app.include_router(departments.router)
app.include_router(escalation.router)
app.include_router(audit_logs.router)
app.include_router(agent_monitor.router)
app.include_router(escalation_dashboard.router)
app.include_router(audit_dashboard.router)
app.include_router(department_dashboard.router)
app.include_router(workflow_logs.router)
app.include_router(memory.router)
app.include_router(analytics.router)
app.include_router(executive_dashboard.router)
app.include_router(history.router)
@app.get("/")
def home():
    return {"message": "Contract AI System Running"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=DEFAULT_APP_HOST,
        port=DEFAULT_APP_PORT,
        reload=True,
    )
