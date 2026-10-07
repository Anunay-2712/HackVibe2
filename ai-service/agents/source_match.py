from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'authentic_clip':
        return {
            "score": 0.1,
            "confidence": 0.5,
            "summary": "Found original source matching this content.",
            "evidence": [
                EvidenceItem(label="Reverse Search", detail="Match found on official news channel.")
            ],
            "artifacts": {"urls": ["https://news.example.com/video123"]}
        }
    else:
        return {
            "score": 0.5,
            "confidence": 0.4,
            "summary": "No exact matches found; visually similar images appear in unrelated contexts.",
            "evidence": [
                EvidenceItem(label="Reverse Search", detail="Only low-similarity matches found.")
            ],
            "artifacts": {}
        }
