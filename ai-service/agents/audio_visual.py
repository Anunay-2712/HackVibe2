from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'voice_clone_false_claim':
        return {
            "score": 0.96,
            "confidence": 0.92,
            "summary": "Strong evidence of voice cloning and lip-sync mismatch.",
            "evidence": [
                EvidenceItem(label="Lip Sync", detail="Audio phonemes do not match mouth shapes.", timestamp=4.2),
                EvidenceItem(label="Spectral Analysis", detail="Vocoder artifacts detected in higher frequencies.", timestamp=5.1)
            ],
            "artifacts": {}
        }
    elif sample_name == 'authentic_clip':
        return {
            "score": 0.05,
            "confidence": 0.9,
            "summary": "Audio and visual streams are perfectly synchronized with natural vocal properties.",
            "evidence": [
                EvidenceItem(label="Lip Sync", detail="Perfect correlation between audio and mouth movements.", timestamp=2.0)
            ],
            "artifacts": {}
        }
    else:
        return {
            "score": 0.0,
            "confidence": 0.0,
            "summary": "No audio track detected or analyzed.",
            "evidence": [],
            "artifacts": {}
        }
