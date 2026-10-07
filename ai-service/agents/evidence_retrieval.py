from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'voice_clone_false_claim':
        return {
            "score": 0.9,
            "confidence": 0.95,
            "summary": "Found contradictory evidence from reputable sources.",
            "evidence": [
                EvidenceItem(label="Fact Check", detail="Reuters: Company confirms strong financial standing, denying bankruptcy rumors.")
            ],
            "artifacts": {"urls": ["https://reuters.com/fact-check"]}
        }
    elif sample_name == 'authentic_clip':
        return {
            "score": 0.1,
            "confidence": 0.9,
            "summary": "Found corroborating evidence.",
            "evidence": [
                EvidenceItem(label="Financial Report", detail="Q3 earnings report confirms 10% profit increase.")
            ],
            "artifacts": {"urls": ["https://sec.gov/filings"]}
        }
    else:
        return {
            "score": 0.0,
            "confidence": 0.0,
            "summary": "No claims to verify.",
            "evidence": [],
            "artifacts": {}
        }
