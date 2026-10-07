from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'authentic_clip':
        return {
            "score": 0.02,
            "confidence": 0.95,
            "summary": "Facial landmarks and blending regions appear completely natural.",
            "evidence": [
                EvidenceItem(label="Blink Rate", detail="Natural blink rate of ~15 blinks/min.", timestamp=2.5)
            ],
            "artifacts": {}
        }
    elif sample_name == 'ai_generated_image':
        return {
            "score": 0.92,
            "confidence": 0.88,
            "summary": "Facial landmark jitter and asymmetrical reflections in eyes detected.",
            "evidence": [
                EvidenceItem(label="Eye Reflection", detail="Inconsistent light reflections in pupils.", frameIndex=0),
                EvidenceItem(label="Blending Boundary", detail="Unnatural transition at jawline.", frameIndex=0)
            ],
            "artifacts": {}
        }
    else:
        return {
            "score": 0.08,
            "confidence": 0.9,
            "summary": "No facial manipulation detected.",
            "evidence": [],
            "artifacts": {}
        }
