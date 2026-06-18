import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)
    
from app.agents.tool_calling_agent import tool_calling_agent

query = "What are the payment obligations?"

response = tool_calling_agent(query)

print(response)