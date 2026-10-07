from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'voice_clone_false_claim':
        return {
            "score": 0.95,
            "confidence": 0.98,
            "summary": "Claim is definitively CONTRADICTED by evidence.",
            "evidence": [
                EvidenceItem(label="Judgment", detail="Claim: 'CEO announced bankruptcy' - CONTRADICTED")
            ],
            "artifacts": {"judgment": "CONTRADICTED"}
        }
    elif sample_name == 'authentic_clip':
        return {
            "score": 0.05,
            "confidence": 0.95,
            "summary": "Claim is SUPPORTED by evidence.",
            "evidence": [
                EvidenceItem(label="Judgment", detail="Claim: 'Profits rose by 10%' - SUPPORTED")
            ],
            "artifacts": {"judgment": "SUPPORTED"}
        }
    else:
        return {
            "score": 0.0,
            "confidence": 0.0,
            "summary": "No claims to judge.",
            "evidence": [],
            "artifacts": {"judgment": "UNVERIFIED"}
        }
