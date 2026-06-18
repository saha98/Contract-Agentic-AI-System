import os
import sys

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.database.db import engine
from app.database.models import *

Base.metadata.create_all(bind=engine)

print("Database tables created successfully")
