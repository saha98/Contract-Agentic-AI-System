import os
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from sqlalchemy import Column, Integer, String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)

    email = Column(String, unique=True)

    role = Column(String)

    company = Column(String)

    hashed_password = Column(String)

class Department(Base):

    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String)

    department_name = Column(String)

    contact_person = Column(String)

    contact_email = Column(String)


class WorkflowLog(Base):

    __tablename__ = "workflow_logs"

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String)

    clause = Column(String)

    risk_level = Column(String)

    assigned_department = Column(String)

    assigned_email = Column(String)

    status = Column(String)

class ContractHistory(Base):

    __tablename__ = "contract_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    contract_name = Column(String)

    upload_date = Column(String)

    clause_count = Column(Integer)

    risk_count = Column(Integer)

    executive_summary = Column(String)

class RiskHistory(Base):

    __tablename__ = "risk_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    contract_name = Column(String)

    clause = Column(String)

    risk_level = Column(String)

    assigned_department = Column(String)