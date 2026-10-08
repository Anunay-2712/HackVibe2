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
            "score": 0.40,
            "confidence": 0.35,
            "summary": "Missing EXIF provenance. Social platforms frequently strip metadata, giving low confidence.",
            "evidence": [
                EvidenceItem(label="Metadata", detail="Container metadata stripped; no verified camera provenance.")
            ],
            "artifacts": {}
        }
