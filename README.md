# Contract AI System (GTSM)

## Intelligent Contract Analysis, Risk Detection & Compliance Monitoring using Agentic AI

### Overview

Contract AI System (GTSM) is an enterprise-grade Agentic AI platform designed to automate contract review, clause comparison, risk assessment, compliance validation, and business insight generation.

Organizations often deal with hundreds of contracts, terms and conditions documents, vendor agreements, legal policies, and compliance documents. Manual review is time-consuming, error-prone, and expensive.

This platform leverages Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), Multi-Agent Architecture, Explainable AI (XAI), and Predictive Analytics to transform contract management into an intelligent, automated workflow.

---

## Business Problem

Organizations face challenges such as:

* Inconsistent contractual clauses across vendors
* Hidden legal and compliance risks
* Time-consuming manual contract reviews
* Difficulty tracking obligations and deviations
* Lack of explainability in AI-driven decisions
* Delayed risk identification

The Contract AI System addresses these challenges through AI-powered contract intelligence and automated risk monitoring.

---

# Key Features

### 📄 Intelligent Document Processing

* PDF Contract Parsing
* Clause Extraction
* Contract Segmentation
* Metadata Identification
* Structured Document Storage

### 🔍 Contract Comparison Engine

* Compare multiple contracts simultaneously
* Identify clause mismatches
* Highlight missing obligations
* Detect policy deviations
* Semantic similarity analysis

### ⚠️ Risk Detection Engine

* Legal Risk Identification
* Compliance Risk Analysis
* Financial Risk Detection
* Regulatory Violation Detection
* Contractual Conflict Detection

### 🤖 Agentic AI Workflow

The platform utilizes multiple AI agents coordinated through an intelligent orchestrator.

#### 1. Ingestion Agent

Responsible for:

* Document Upload
* PDF Parsing
* Data Cleaning
* Metadata Extraction
* Vector Store Population

#### 2. Clause Analysis Agent

Responsible for:

* Clause Extraction
* Clause Classification
* Semantic Understanding
* Clause Matching
* Deviation Detection

#### 3. Risk Assessment Agent

Responsible for:

* Risk Scoring
* Compliance Validation
* Risk Categorization
* Anomaly Detection
* Predictive Risk Modeling

#### 4. Insight Generation Agent

Responsible for:

* Executive Summaries
* Business Recommendations
* Trend Analysis
* Opportunity Detection
* Actionable Insights

#### 5. Communication Agent

Responsible for:

* Report Generation
* Email Notifications
* Escalation Triggers
* Stakeholder Communication
* Audit Logging

#### 6. Adaptive Orchestrator Agent

Acts as the brain of the system.

Responsibilities:

* Dynamic Agent Selection
* Workflow Management
* Context Sharing
* Task Routing
* Multi-Agent Coordination

---

# AI & Machine Learning Components

### Large Language Models (LLMs)

* Ollama
* Llama 3.2
* Local AI Inference

### Retrieval-Augmented Generation (RAG)

Used for:

* Contract Knowledge Retrieval
* Context-Aware Responses
* Semantic Search
* Document Question Answering

### Predictive Analytics

Models can be used for:

* Contract Risk Prediction
* Non-Compliance Forecasting
* Vendor Risk Assessment
* Escalation Probability Analysis

### Explainable AI (XAI)

To ensure transparency:

* Risk Explanation
* Decision Justification
* Confidence Scores
* Feature Importance Analysis
* Human-Readable Interpretations

---

# System Architecture

```text
User Uploads Contract
           │
           ▼
   Ingestion Agent
           │
           ▼
   Clause Analysis Agent
           │
           ▼
   Risk Assessment Agent
           │
           ▼
   Insight Generation Agent
           │
           ▼
  Communication Agent
           │
           ▼
     Final Report

           ▲
           │
 Adaptive Orchestrator
```

---

# Technology Stack

## Backend

* FastAPI
* Python
* LangChain
* LangGraph
* Ollama
* Pydantic

## AI/ML

* Llama 3.2
* RAG
* Vector Embeddings
* Explainable AI (XAI)
* Predictive Analytics

## Database & Storage

* SQLite / PostgreSQL
* Vector Database
* Local File Storage

## Frontend

* React
* Vite
* TypeScript
* Tailwind CSS

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/contract-ai-system.git

cd contract-ai-system
```

## Install Dependencies

```bash
C:/ProgramData/anaconda3/python.exe -m pip install -r requirements.txt
```

## Install Ollama

Download and install Ollama.

Pull the required model:

```bash
ollama pull llama3.2:3b
```

You can change the model through:

```env
OLLAMA_MODEL=llama3.2:3b
```

---

# Running the Application

## Start Backend

```bash
C:/ProgramData/anaconda3/python.exe -m uvicorn app.main:app --reload
```

Alternative:

```bash
C:/ProgramData/anaconda3/python.exe -m app
```

Or:

```bash
./run.bat
```

---

## Start Frontend

```bash
cd gtsm-frontend

npm install

npm run dev
```

---

# Example Workflow

1. Upload Contract Documents
2. AI Extracts Clauses
3. System Builds Knowledge Base
4. Contracts are Compared
5. Risks are Identified
6. Insights are Generated
7. Compliance Checks are Performed
8. Executive Report is Produced
9. Alerts and Notifications are Triggered

---

# Future Enhancements

* Real-time Compliance Monitoring
* Regulatory Knowledge Graph
* Multi-Language Contract Support
* Advanced Risk Prediction Models
* Human-in-the-Loop Approval Workflows
* Enterprise RBAC
* Dashboard Analytics
* Cloud Deployment (AWS/Azure/GCP)

---

# Use Cases

### Financial Services

* Vendor Agreement Analysis
* Compliance Monitoring
* Regulatory Risk Assessment

### Legal Teams

* Contract Review Automation
* Clause Standardization
* Legal Risk Detection

### Procurement

* Supplier Contract Evaluation
* Obligation Tracking
* Vendor Risk Assessment

### Enterprise Governance

* Policy Compliance
* Audit Readiness
* Risk Governance

---

# Author

**Suvodeep Saha**

Data Scientist | AI/ML Engineer | Agentic AI Developer

Focused on building enterprise AI systems using Multi-Agent Architectures, RAG, Explainable AI, Predictive Analytics, and Large Language Models.
