import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load models config to ensure env vars are set
import models_config
from utils.schema import AgentResult
from agents.base import execute_agent

# Import agent analyzers
from agents.pixel_forensics import analyze as analyze_pixel
from agents.face_consistency import analyze as analyze_face
from agents.metadata_provenance import analyze as analyze_metadata
from agents.audio_visual import analyze as analyze_audio
from agents.source_match import analyze as analyze_source
from agents.claim_extractor import analyze as analyze_extractor
from agents.evidence_retrieval import analyze as analyze_evidence
from agents.claim_judge import analyze as analyze_judge

load_dotenv()

app = FastAPI(title="DeepTrace AI Service (Mock)")

from fastapi.staticfiles import StaticFiles

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
os.makedirs(ARTIFACTS_DIR, exist_ok=True)
app.mount("/artifacts", StaticFiles(directory=ARTIFACTS_DIR), name="artifacts")

@app.get("/health")
async def health_check():
    return {"status": "ok", "mock_mode": models_config.MOCK_MODE}

AGENT_ROUTING = {
    "pixel_forensics": {"track": "media", "func": analyze_pixel},
    "face_consistency": {"track": "media", "func": analyze_face},
    "metadata_provenance": {"track": "media", "func": analyze_metadata},
    "audio_visual": {"track": "media", "func": analyze_audio},
    "source_match": {"track": "media", "func": analyze_source},
    "claim_extractor": {"track": "claim", "func": analyze_extractor},
    "evidence_retrieval": {"track": "claim", "func": analyze_evidence},
    "claim_judge": {"track": "claim", "func": analyze_judge},
}

@app.post("/agents/{agent_name}", response_model=AgentResult)
async def run_agent(agent_name: str, request: Request):
    if agent_name not in AGENT_ROUTING:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    route = AGENT_ROUTING[agent_name]
    
    content_type = request.headers.get("content-type", "")
    
    file_path = None
    sample_name = "default"
    
    if "application/json" in content_type:
        try:
            data = await request.json()
            file_path = data.get("file_path")
            sample_name = data.get("sample_name", "default")
        except Exception:
            pass
    elif "multipart/form-data" in content_type or "application/x-www-form-urlencoded" in content_type:
        form = await request.form()
        file_path = form.get("file_path")
        if isinstance(file_path, str):
            pass
        elif hasattr(file_path, "filename"):
            file_path = getattr(file_path, "filename")
        else:
            file_path = None
            
        sample_name = form.get("sample_name", "default")
        
    path_to_use = file_path if file_path else "uploaded_file_mock_path"
    
    result = await execute_agent(
        agent_name=agent_name,
        track=route["track"],
        func=route["func"],
        file_path=path_to_use,
        sample_name=sample_name
    )
    return result
