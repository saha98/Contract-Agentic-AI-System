import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import uploads, compare, chat, feedback, conversation, adaptive, auth, departments, escalation, audit_logs, agent_monitor, escalation_dashboard, audit_dashboard, department_dashboard, workflow_logs, memory, analytics
from app.routes import executive_dashboard
from app.routes import history

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
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

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
