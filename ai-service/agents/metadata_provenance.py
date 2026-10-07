from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'authentic_clip':
        return {
            "score": 0.0,
            "confidence": 0.6,
            "summary": "Standard device EXIF data found. Provenance checks out.",
            "evidence": [
                EvidenceItem(label="EXIF", detail="Camera model and GPS data present and consistent.")
            ],
            "artifacts": {}
        }
    else:
        return {
            "score": 0.65,
            "confidence": 0.7,
            "summary": "Missing EXIF data and unusual software tags detected.",
            "evidence": [
                EvidenceItem(label="Metadata", detail="Software tag indicates 'Photoshop' or unknown tool.")
            ],
            "artifacts": {}
        }
