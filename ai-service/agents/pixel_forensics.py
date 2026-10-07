from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    if sample_name == 'authentic_clip':
        return {
            "score": 0.05,
            "confidence": 0.9,
            "summary": "Error Level Analysis (ELA) and spatial frequency checks show no signs of manipulation.",
            "evidence": [
                EvidenceItem(label="ELA", detail="Uniform compression levels across image.", frameIndex=0)
            ],
            "artifacts": {"heatmapUrl": "/artifacts/mock_authentic_heatmap.png"}
        }
    elif sample_name == 'voice_clone_false_claim':
        return {
            "score": 0.1,
            "confidence": 0.8,
            "summary": "Visual analysis indicates video track is largely unaltered.",
            "evidence": [
                EvidenceItem(label="Spatial Analysis", detail="Natural camera noise present.", timestamp=0.0)
            ],
            "artifacts": {}
        }
    else: # ai_generated_image or default
        return {
            "score": 0.85,
            "confidence": 0.95,
            "summary": "Strong indicators of GAN-based synthesis detected in frequency domain and ELA.",
            "evidence": [
                EvidenceItem(label="Frequency Artifacts", detail="High-frequency spectral anomalies detected.", frameIndex=0),
                EvidenceItem(label="ELA Anomalies", detail="Inconsistent compression signatures found in focal areas.", frameIndex=0)
            ],
            "artifacts": {"heatmapUrl": "/artifacts/mock_fake_heatmap.png"}
        }
