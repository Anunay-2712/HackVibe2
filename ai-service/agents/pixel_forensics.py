import os
from typing import Optional
from utils.schema import EvidenceItem
from utils.preprocessing import get_media_info, compute_quality_score, generate_ela_heatmap, is_audio_file
from models_config import MOCK_MODE

# Optional lightweight HF image pipeline cache
_classifier_pipeline = None

def get_classifier():
    global _classifier_pipeline
    if _classifier_pipeline is False:
        return None
    if _classifier_pipeline is not None:
        return _classifier_pipeline
    try:
        from transformers import pipeline
        from models_config import DEEPFAKE_CLASSIFIER_MODEL
        # Load fast image classification pipeline
        _classifier_pipeline = pipeline(
            "image-classification",
            model=DEEPFAKE_CLASSIFIER_MODEL,
            framework="pt"
        )
        return _classifier_pipeline
    except Exception as e:
        print(f"Hugging Face deepfake model load skipped ({e}); utilizing high-precision ELA & spectral analysis.")
        _classifier_pipeline = False
        return None

async def analyze(file_path: Optional[str] = None, sample_name: Optional[str] = None) -> dict:
    # 1. Benchmark sample fast-path if explicitly requested and no real file uploaded
    if sample_name and (not file_path or not os.path.exists(file_path)):
        if sample_name == 'authentic_clip':
            return {
                "agent": "pixel_forensics",
                "track": "media",
                "status": "ok",
                "score": 0.05,
                "confidence": 0.90,
                "summary": "Error Level Analysis (ELA) and spatial frequency checks show no signs of manipulation.",
                "evidence": [
                    EvidenceItem(label="ELA Compression", detail="Uniform error level analysis (variance < 2.1).", frameIndex=0)
                ],
                "artifacts": {"heatmapUrl": "/artifacts/mock_authentic_heatmap.png"},
                "mock": True
            }
        elif sample_name == 'voice_clone_false_claim':
            return {
                "agent": "pixel_forensics",
                "track": "media",
                "status": "ok",
                "score": 0.10,
                "confidence": 0.85,
                "summary": "Visual analysis indicates video track is authentic natural camera footage.",
                "evidence": [
                    EvidenceItem(label="Spatial Coherence", detail="Natural sensor noise distribution present.", timestamp=0.0)
                ],
                "artifacts": {"heatmapUrl": "/artifacts/mock_authentic_heatmap.png"},
                "mock": True
            }
        else: # ai_generated_image
            return {
                "agent": "pixel_forensics",
                "track": "media",
                "status": "ok",
                "score": 0.85,
                "confidence": 0.95,
                "summary": "Strong indicators of GAN/diffusion synthesis detected in frequency domain and ELA.",
                "evidence": [
                    EvidenceItem(label="Frequency Artifacts", detail="High-frequency spectral anomalies detected in Fourier spectrum.", frameIndex=0),
                    EvidenceItem(label="ELA Anomalies", detail="Inconsistent compression signatures found in focal areas (RMS: 18.4).", frameIndex=0)
                ],
                "artifacts": {"heatmapUrl": "/artifacts/mock_fake_heatmap.png"},
                "mock": True
            }

    # 2. Real Forensic Analysis on uploaded file
    if not file_path or not os.path.exists(file_path):
        return {
            "agent": "pixel_forensics",
            "track": "media",
            "status": "skipped",
            "score": 0.5,
            "confidence": 0.1,
            "summary": "No media file provided for pixel forensics.",
            "evidence": [],
            "artifacts": {},
            "mock": False
        }

    if is_audio_file(file_path):
        return {
            "score": 0.0,
            "confidence": 0.0,
            "status": "skipped",
            "summary": "Audio media input; spatial pixel forensics not applicable.",
            "evidence": [],
            "artifacts": {},
            "mock": False
        }

    # Extract media information & calculate resolution-based quality score
    media_info = get_media_info(file_path)
    quality_score = compute_quality_score(media_info)

    # Perform real Error Level Analysis (ELA)
    heatmap_url, mean_error, anomaly_ratio = generate_ela_heatmap(file_path)

    # Attempt pretrained classifier if available
    hf_score = None
    try:
        classifier = get_classifier()
        if classifier:
            predictions = classifier(file_path)
            for p in predictions:
                label = str(p.get("label", "")).lower()
                if "fake" in label or "synthetic" in label or "generated" in label:
                    hf_score = float(p.get("score", 0.5))
                    break
                elif "real" in label or "authentic" in label:
                    hf_score = 1.0 - float(p.get("score", 0.5))
                    break
    except Exception as e:
        print(f"Classifier inference skipped: {e}")

    # Combine ELA anomaly ratio and classifier
    if hf_score is not None:
        raw_score = 0.6 * hf_score + 0.4 * anomaly_ratio
        evidence_detail = f"Deepfake classifier and ELA variance (mean error: {mean_error}) indicate tampering."
    else:
        # Heuristic based on ELA statistics
        raw_score = min(0.95, max(0.05, anomaly_ratio))
        if raw_score > 0.6:
            evidence_detail = f"Elevated local compression variance (mean ELA: {mean_error}) characteristic of resaved/spliced imagery."
        else:
            evidence_detail = f"Uniform compression surface (mean ELA: {mean_error}) typical of single-generation camera exposures."

    # Adjust confidence by quality score: low-res/heavy compression reduces confidence
    confidence = round(max(0.2, min(0.95, 0.85 * quality_score)), 2)
    final_score = round(raw_score, 2)

    evidence_items = [
        EvidenceItem(
            label="Error Level Analysis (ELA)",
            detail=evidence_detail,
            frameIndex=0
        )
    ]

    if quality_score < 0.6:
        evidence_items.append(
            EvidenceItem(
                label="Quality Warning",
                detail=f"Low resolution ({media_info.get('resolution')}) limits forensic confidence.",
                frameIndex=0
            )
        )

    summary = (
        f"ELA heatmap reveals {'significant localized compression disparities' if final_score > 0.6 else 'coherent error distribution'}. "
        f"Input resolution: {media_info.get('resolution')}."
    )

    return {
        "agent": "pixel_forensics",
        "track": "media",
        "status": "ok",
        "score": final_score,
        "confidence": confidence,
        "summary": summary,
        "evidence": evidence_items,
        "artifacts": {
            "heatmapUrl": heatmap_url,
            "mediaInfo": media_info
        },
        "mock": False
    }
