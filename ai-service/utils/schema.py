from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal

class EvidenceItem(BaseModel):
    label: str
    detail: str
    timestamp: Optional[float] = None
    frameIndex: Optional[int] = None

class AgentResult(BaseModel):
    agent: str
    track: Literal["media", "claim"]
    status: Literal["ok", "error", "skipped"]
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    summary: str
    evidence: List[EvidenceItem] = []
    artifacts: Dict[str, Any] = {}
    mock: bool = False
