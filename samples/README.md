# 🧪 DeepTrace Sample Media & Test Scenarios

This directory provides pre-configured test scenarios and instructions for evaluating DeepTrace's multi-agent misinformation detection pipeline.

---

## 🎯 Test Samples Overview

| Sample Identifier | Label | Media Type | Expected Verdict | Primary Focus |
| :--- | :--- | :---: | :---: | :--- |
| `authentic_clip` | **Authentic News Clip** | Video (`.mp4`) | **LIKELY REAL** | Baseline verification of authentic footage, natural speech patterns, and verified claims. |
| `ai_generated_image` | **AI-Generated Portrait** | Image (`.jpg` / `.png`) | **LIKELY FAKE** | Pixel forensics, frequency artifact inspection (DCT/FFT), noise inconsistencies, and synthetic generation markers. |
| `voice_clone_false_claim` | **Voice-Cloned Misinformation** | Video (`.mp4`) | **LIKELY FAKE** | Audio forensics (cloned voice artifacts), AV sync mismatches, and Cross-Link correlation with debunked factual claims. |

---

## 🔬 What Each Sample Tests

### 1. `authentic_clip` (Authentic News Broadcast)
* **Goal:** Prove the system avoids false positives on genuine journalism and unedited broadcasts.
* **Pixel / Video Forensics:** Preserves natural sensor noise, consistent lighting, and organic compression artifacts.
* **Audio Forensics:** Natural acoustic resonance, breathing cadence, and typical vocal tract dynamics.
* **Claim & Fact-Checking:** Extracted statements correlate positively with verified news wire entries and trusted consensus.
* **Cross-Link / Judge:** Harmonious alignment across pixel, audio, and claim dimensions yields a high-confidence **`LIKELY REAL`** verdict.

### 2. `ai_generated_image` (Diffusion-Generated Portrait)
* **Goal:** Evaluate visual forensics on high-quality synthetic stills (e.g., Midjourney, Flux, Stable Diffusion).
* **Pixel Forensics:** Detects latent artifacts in high-frequency spectral bands, unnatural symmetry/asymmetry in facial features, and anomalous noise distributions.
* **Audio & Claim:** Inactive or not applicable for image-only media.
* **Cross-Link / Judge:** Flags anomalous synthetic signatures and outputs a **`LIKELY FAKE`** verdict with deep forensic explanations.

### 3. `voice_clone_false_claim` (Voice Clone with False Claims)
* **Goal:** Demonstrate the crucial power of multi-agent cross-correlation when facial manipulation alone is absent or subtle.
* **The Challenge:** Traditional face-only deepfake detectors often fail here because the video footage may be genuine historical or recycled footage.
* **Audio Forensics:** Uncovers synthetic vocoder artifacts, missing micro-tremors in pitch, and unnatural spectral phase continuity.
* **Claim & Fact-Checking:** Extracts factual assertions made in speech and cross-references them against fact-checking databases, finding known debunked narratives.
* **Cross-Link Analysis:** Detects the contradiction: while facial pixels might appear authentic, audio synthesis and false claim indicators trigger multi-dimensional red flags, leading to an unequivocal **`LIKELY FAKE`** verdict.

---

## 📁 Real File Placement

When running in real evaluation mode, place your test media files into this directory matching the names referenced in [`sample_config.json`](./sample_config.json):

```text
samples/
├── sample_config.json
├── README.md
├── authentic_clip.mp4           <-- Real authentic news clip video
├── ai_generated_image.jpg       <-- Real synthetic portrait image
└── voice_clone_false_claim.mp4  <-- Real voice-cloned video
```

---

## ⚙️ How MOCK_MODE Works

DeepTrace includes a built-in simulation layer controlled via the root `.env` file:

```env
MOCK_MODE=true
```

### When `MOCK_MODE=true`:
* **Zero Heavy Dependencies Required:** No need to download multi-gigabyte PyTorch/HuggingFace checkpoints, Whisper models, or wait for GPU initialization.
* **Instantaneous Demonstrations:** The orchestrator and agents simulate realistic timing, step-by-step agent deliberations, tool invocations, and confidence scoring.
* **Full UI & API Functionality:** The frontend dashboard, WebSocket event streams, forensic charts, claim breakdowns, and judge reports render fully functional interactive outputs identical to real inference.
* **Preset Profiles:** Selecting one of the sample presets in the frontend automatically triggers the complete investigation lifecycle tailored to that test case.

### When switching to Real Mode (`MOCK_MODE=false`):
1. Configure valid API keys (`GEMINI_API_KEY`, `FACTCHECK_API_KEY`) in `.env`.
2. Ensure the Python AI service has model weights loaded (or internet connectivity to fetch them).
3. Upload actual media files through the UI or target the files placed in this directory.
