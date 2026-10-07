# 🛡️ DeepTrace — Multi-Agent Misinformation Investigation System

[![HACKVIBE 2.0](https://img.shields.io/badge/HACKVIBE%202.0-Hackathon%20Project-blueviolet?style=for-the-badge&logo=target)](https://github.com)
[![Status: Phase 1](https://img.shields.io/badge/Status-Phase%201%20(Mock%20Mode)-success?style=for-the-badge)](./.env)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-team--license)

> **DeepTrace** is an autonomous, multi-agent multimodal intelligence system engineered to detect deepfakes, synthetic media, and coordinated misinformation. By orchestrating specialized forensic agents across pixel integrity, acoustic signatures, semantic claims, and cross-modal correlation, DeepTrace moves beyond single-signal detectors to deliver explainable, evidentiary verdicts.

---

> [!NOTE]
> **Phase 1 Implementation Notice**: This deployment is currently pre-configured for **Phase 1 (Mock Mode)**. The entire multi-agent orchestration pipeline, interactive dashboard, streaming reports, and verdict deliberation can be demonstrated out-of-the-box without requiring local GPUs or heavy model weight downloads.

---

## 🏛️ System Architecture

DeepTrace is designed as a decoupled, resilient 3-tier microservice architecture:

```
                      ┌────────────────────────────────────────┐
                      │          React + Vite Frontend         │
                      │         (Port 5173 - Client UI)        │
                      └──────────────────┬─────────────────────┘
                                         │ HTTP / REST & WebSockets
                                         ▼
                      ┌────────────────────────────────────────┐
                      │       Node.js Orchestrator API         │
                      │         (Port 3001 - Dispatcher)       │
                      │  - Agent Pipeline Execution Manager    │
                      │  - Multi-Agent Synthesis & Cross-Link  │
                      │  - SSE / WebSocket Live Streamer       │
                      └──────────────────┬─────────────────────┘
                                         │ JSON RPC / REST
                                         ▼
                      ┌────────────────────────────────────────┐
                      │        FastAPI Python AI Service       │
                      │          (Port 8000 - Forensics)       │
                      │  - Pixel & Visual Artifact Models      │
                      │  - Audio & Vocoder Clone Detection     │
                      │  - Semantic Claim Extraction & Gemini  │
                      │  - Fact-Check Knowledge Graph Search   │
                      └────────────────────────────────────────┘
```

```
           ┌────────────────────────────────────────────────────────┐
           │            Multi-Agent Investigation Swarm             │
           └────────────────────────────────────────────────────────┘
                                      │
            ┌─────────────────────────┼────────────────────────┐
            ▼                         ▼                        ▼
  ┌──────────────────┐      ┌──────────────────┐     ┌──────────────────┐
  │  Pixel Forensics │      │ Audio Forensics  │     │ Claim Extraction │
  │      Agent       │      │      Agent       │     │  & Fact-Check    │
  └─────────┬────────┘      └─────────┬────────┘     └─────────┬────────┘
            │                         │                        │
            └─────────────────────────┼────────────────────────┘
                                      ▼
                      ┌────────────────────────────────┐
                      │    Cross-Link Correlation      │
                      │             Agent              │
                      └───────────────┬────────────────┘
                                      ▼
                      ┌────────────────────────────────┐
                      │       Autonomous Judge         │
                      │       Evidentiary Report       │
                      └────────────────────────────────┘
```

---

## 🤖 Specialized Forensic Agents

| Agent Name | Scope | Analysis Methodology & Signals |
| :--- | :--- | :--- |
| **👁️ Pixel Forensics** | Visual / Spatial | Examines discrete cosine transform (DCT) frequency distributions, noise residuals, blending boundaries, facial micro-inconsistencies, and diffusion generation artifacts. |
| **🎙️ Audio Forensics** | Acoustic / Speech | Identifies vocoder synthesis signatures, phase discontinuities, artificial pitch stability, cloned voice markers, and audio-video lip synchronization discrepancies. |
| **📝 Claim Extraction** | Natural Language | Extracts discrete factual propositions and contextual assertions from speech transcriptions and embedded on-screen text via LLM reasoning. |
| **🔍 Fact-Checking** | Knowledge / Consensus | Queries Google Fact Check Tools and authoritative knowledge bases to discover existing debunking analyses and historical debunk records. |
| **🔗 Cross-Link Analysis** | Multimodal Fusion | Detects cross-modal discrepancies (e.g. authentic face combined with synthetic voice, or genuine audio with out-of-context video overlay). |
| **⚖️ Autonomous Judge** | Synthesis & Verdict | Aggregates confidence-weighted findings from all agents, weighs contradictory evidence, and generates an auditable, human-readable forensic verdict. |

---

## ⚡ Quick Start (3 Steps)

Get DeepTrace running locally in under 3 minutes:

### Step 1: Install Dependencies
```bash
# 1. Install Orchestrator dependencies
cd orchestrator && npm install

# 2. Install Frontend dependencies
cd ../frontend && npm install

# 3. Install AI Service dependencies
cd ../ai-service && pip install -r requirements.txt
```

### Step 2: Configure Environment
Copy the example environment configuration to `.env` in the root (already created by default for mock mode):
```bash
# From repository root:
cp .env.example .env
```

### Step 3: Launch Services
Open 3 terminal windows or tabs:

* **Terminal 1 — Orchestrator:**
  ```bash
  cd orchestrator && npm run dev
  ```
* **Terminal 2 — Python AI Service:**
  ```bash
  cd ai-service && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  ```
* **Terminal 3 — Frontend Dashboard:**
  ```bash
  cd frontend && npm run dev
  ```

Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 📋 Prerequisites

| Prerequisite | Recommended Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.x` | Orchestrator backend and Vite frontend development server |
| **Python** | `>= 3.10` | FastAPI forensic AI service and model inference |
| **FFmpeg** | `>= 5.x` | Media splitting, audio demuxing, and frame extraction *(Real mode)* |
| **npm / pnpm** | `>= 9.x` | Package management for JavaScript ecosystems |

---

## 🛠️ Detailed Service Setup

### 1. Orchestrator Service (`/orchestrator`)
The orchestration layer coordinates analysis runs, aggregates agent outputs, handles file uploads, and delivers live updates.
```bash
cd orchestrator
npm install
npm run dev
# Running on http://localhost:3001
```

### 2. AI Forensic Service (`/ai-service`)
The Python FastAPI service hosts forensic algorithms, feature extraction endpoints, and LLM reasoning integrations.
```bash
cd ai-service
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000 --reload
# Running on http://localhost:8000
```

### 3. Frontend Application (`/frontend`)
The single-page application displays investigation timelines, radar diagrams, agent logs, and evidence breakdowns.
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🎛️ Mock Mode vs. Real Mode

DeepTrace includes a toggle in [`.env`](./.env) designed for hackathon evaluation:

```env
MOCK_MODE=true
```

| Dimension | Mock Mode (`MOCK_MODE=true`) | Real Mode (`MOCK_MODE=false`) |
| :--- | :--- | :--- |
| **Hardware Required** | Standard laptop / lightweight CPU | GPU recommended (CUDA / Metal) for deep neural networks |
| **External API Keys** | None required | Gemini API, Google Fact Check API, News API |
| **Latency** | Instantaneous / simulated progressive streaming | 15–45 seconds depending on file length and video resolution |
| **Test Data** | Pre-bundled test scenarios in [`samples/`](./samples) | Custom user uploads & live scraped web URLs |
| **Execution Path** | Deterministic agent traces for predictable judging | Dynamic live inference through multi-model pipeline |

---

## 📡 API Endpoints Summary

### Orchestrator Endpoints (`http://localhost:3001`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status and mode flag |
| `GET` | `/api/samples` | List available pre-configured test scenarios |
| `POST` | `/api/investigate/sample` | Trigger an investigation on a predefined sample scenario |
| `POST` | `/api/investigate/upload` | Upload video/image for investigation |
| `GET` | `/api/investigate/:id` | Retrieve investigation status and full verdict report |
| `WS` | `/ws/investigate/:id` | Live WebSocket stream for real-time agent thoughts & logs |

### AI Service Endpoints (`http://localhost:8000`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Python service diagnostic and model readiness |
| `POST` | `/api/forensics/pixel` | Visual frame artifact detection & frequency analysis |
| `POST` | `/api/forensics/audio` | Synthetic speech detection & acoustic consistency |
| `POST` | `/api/claims/extract` | LLM-based claim proposition extraction from transcript |
| `POST` | `/api/claims/verify` | Fact-check verification against external knowledge sources |
| `POST` | `/api/judge/deliberate` | Final autonomous judge deliberation and evidentiary synthesis |

---

## 🧪 Included Test Samples

Refer to [samples/README.md](./samples/README.md) for full descriptions:

1. **`authentic_clip`** — Authentic broadcast footage (`LIKELY REAL`).
2. **`ai_generated_image`** — Diffusion-model generated photorealistic face (`LIKELY FAKE`).
3. **`voice_clone_false_claim`** — Real video synchronized with cloned speech making false assertions (`LIKELY FAKE` caught by Cross-Link).

---

## 🧰 Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
* **Orchestration:** Node.js, Express, TypeScript, WebSockets / SSE
* **AI & Machine Learning:** Python, FastAPI, PyTorch, Librosa, OpenCV, NumPy
* **LLM & Fact Checking:** Google Gemini API, Google Fact Check Tools API
* **Tooling & Packaging:** dotenv, FFmpeg

---

## 👥 Team & License

* **Hackathon:** HACKVIBE 2.0
* **Project Team:** DeepTrace Investigation Team
* **License:** Licensed under the [MIT License](LICENSE).
