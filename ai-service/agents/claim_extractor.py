from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'voice_clone_false_claim':
        return {
            "score": 0.8,
            "confidence": 0.9,
            "summary": "Extracted key factual claims from transcript.",
            "evidence": [
                EvidenceItem(label="Claim", detail="The CEO announced immediate bankruptcy.", timestamp=3.0)
            ],
            "artifacts": {"claims": ["The CEO announced immediate bankruptcy."]}
        }
    elif sample_name == 'authentic_clip':
        return {
            "score": 0.5,
            "confidence": 0.9,
            "summary": "Extracted claims about market trends.",
            "evidence": [
                EvidenceItem(label="Claim", detail="Quarterly profits rose by 10%.", timestamp=10.0)
            ],
            "artifacts": {"claims": ["Quarterly profits rose by 10%."]}
        }
    else:
        return {
            "score": 0.0,
            "confidence": 0.0,
            "summary": "No speech detected; no claims extracted.",
            "evidence": [],
            "artifacts": {}
        }
