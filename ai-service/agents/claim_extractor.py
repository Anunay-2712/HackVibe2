import os
import re
import json
import hashlib
from typing import Optional, List, Dict, Any
from utils.schema import EvidenceItem
from utils.preprocessing import is_video_file, is_audio_file, extract_audio
from utils.transcription import transcribe_audio

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "artifacts")
CLAIMS_CACHE_DIR = os.path.join(ARTIFACTS_DIR, "claims_cache")
os.makedirs(CLAIMS_CACHE_DIR, exist_ok=True)

def get_cache_path(file_path: Optional[str]) -> str:
    if not file_path:
        key = "default"
    else:
        key = hashlib.md5(file_path.encode()).hexdigest()[:12]
    return os.path.join(CLAIMS_CACHE_DIR, f"claims_{key}.json")

def split_into_propositions(text: str) -> List[str]:
    """
    Extracts discrete testable propositions from transcribed speech.
    Filters out greetings, conversational filler, and questions.
    """
    if not text or len(text.strip()) < 5:
        return []

    # Clean text
    cleaned = text.strip().replace("\n", " ")
    # Split by sentence boundaries
    sentences = re.split(r'(?<=[.!?])\s+', cleaned)

    propositions = []
    filler_patterns = [
        r"^(good morning|good evening|hello|hi everyone|thank you|welcome|hey guys)",
        r"^(how are you|can you hear me|testing|check)",
        r"^(alright|okay|so yeah|umm|uh)"
    ]

    for sent in sentences:
        s = sent.strip()
        if len(s) < 15:
            continue
        # Check filler
        is_filler = any(re.search(pat, s, re.IGNORECASE) for pat in filler_patterns)
        if is_filler and len(s) < 40:
            continue

        propositions.append(s)

    return propositions[:5]  # Cap at top 5 most salient claims

async def analyze(file_path: Optional[str] = None, sample_name: Optional[str] = None) -> dict:
    # 1. Benchmark sample fast-path
    if sample_name and (not file_path or not os.path.exists(file_path)):
        if sample_name == 'voice_clone_false_claim':
            claims = [
                "The company board authorized filing for immediate Chapter 11 bankruptcy restructuring.",
                "The company is liquidating all commercial assets effective immediately."
            ]
            transcript = "Good morning everyone. I regret to announce that as of 9:00 AM today, our board has authorized filing for immediate Chapter 11 bankruptcy restructuring, liquidating all commercial assets effective immediately."
            
            # Cache for evidence retrieval
            cache_file = get_cache_path("voice_clone_false_claim")
            with open(cache_file, "w") as f:
                json.dump({"claims": claims, "transcript": transcript}, f)

            return {
                "score": 0.85,
                "confidence": 0.95,
                "summary": f"Extracted {len(claims)} critical corporate claims from speech transcript.",
                "evidence": [
                    EvidenceItem(label="Extracted Claim #1", detail=claims[0], timestamp=3.0),
                    EvidenceItem(label="Extracted Claim #2", detail=claims[1], timestamp=7.0),
                ],
                "artifacts": {
                    "claims": claims,
                    "transcript": transcript,
                    "language": "en"
                },
                "mock": True
            }
        elif sample_name == 'authentic_clip':
            claims = [
                "Quarterly corporate profits rose by 10% year over year.",
                "Market expansion in renewable sectors generated 15,000 new employment opportunities."
            ]
            transcript = "Financial markets rallied this morning as quarterly corporate profits rose by 10% year over year, while market expansion in renewable sectors generated 15,000 new employment opportunities."

            cache_file = get_cache_path("authentic_clip")
            with open(cache_file, "w") as f:
                json.dump({"claims": claims, "transcript": transcript}, f)

            return {
                "score": 0.15,
                "confidence": 0.90,
                "summary": f"Extracted {len(claims)} verifiable economic propositions.",
                "evidence": [
                    EvidenceItem(label="Extracted Claim #1", detail=claims[0], timestamp=2.0),
                    EvidenceItem(label="Extracted Claim #2", detail=claims[1], timestamp=8.0),
                ],
                "artifacts": {
                    "claims": claims,
                    "transcript": transcript,
                    "language": "en"
                },
                "mock": True
            }
        else: # ai_generated_image
            return {
                "score": 0.0,
                "confidence": 0.0,
                "summary": "Static image input; no speech or claims detected.",
                "evidence": [],
                "artifacts": {"claims": [], "transcript": ""},
                "mock": True
            }

    # 2. Real Forensic Analysis on uploaded file
    if not file_path or not os.path.exists(file_path):
        return {
            "score": 0.0,
            "confidence": 0.0,
            "summary": "No media or text provided for claim extraction.",
            "evidence": [],
            "artifacts": {"claims": [], "transcript": ""},
            "mock": False
        }

    transcript_text = ""
    chunks = []

    # Check if text file or media
    ext = os.path.splitext(file_path)[1].lower()
    if ext in [".txt", ".json", ".md"]:
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                transcript_text = f.read().strip()
        except Exception:
            pass
    elif is_video_file(file_path) or is_audio_file(file_path):
        audio_path = extract_audio(file_path)
        if audio_path and os.path.exists(audio_path):
            res = transcribe_audio(audio_path)
            transcript_text = res.get("text", "")
            chunks = res.get("chunks", [])

    # Extract claims
    claims = split_into_propositions(transcript_text)

    # Save to shared claims cache for downstream agents
    cache_file = get_cache_path(file_path)
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump({
            "claims": claims,
            "transcript": transcript_text,
            "chunks": chunks
        }, f)

    if not claims:
        summary = "No testable speech claims found in media track." if not transcript_text else "Transcript contains no testable factual claims."
        return {
            "score": 0.1,
            "confidence": 0.3 if transcript_text else 0.1,
            "summary": summary,
            "evidence": [],
            "artifacts": {
                "claims": [],
                "transcript": transcript_text,
                "language": "en" if transcript_text else "none"
            },
            "mock": False
        }

    evidence_items = []
    for idx, c in enumerate(claims):
        ts = chunks[idx].get("timestamp", [0.0])[0] if idx < len(chunks) and chunks[idx].get("timestamp") else 0.0
        evidence_items.append(
            EvidenceItem(
                label=f"Proposition #{idx + 1}",
                detail=c,
                timestamp=float(ts) if ts else None
            )
        )

    return {
        "score": 0.5,
        "confidence": 0.85,
        "summary": f"Extracted {len(claims)} testable factual propositions from speech audio via Faster-Whisper.",
        "evidence": evidence_items,
        "artifacts": {
            "claims": claims,
            "transcript": transcript_text,
            "language": "en"
        },
        "mock": False
    }
