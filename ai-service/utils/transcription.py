import os
import wave
import numpy as np
from typing import Dict, Any, Optional

# Ensure bin directory containing ffmpeg.exe exists and is in PATH
BIN_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "bin")
ffmpeg_exe_path = os.path.join(BIN_DIR, "ffmpeg.exe")
if not os.path.exists(ffmpeg_exe_path):
    try:
        import shutil
        import imageio_ffmpeg
        src_ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
        if src_ffmpeg and os.path.exists(src_ffmpeg):
            os.makedirs(BIN_DIR, exist_ok=True)
            shutil.copyfile(src_ffmpeg, ffmpeg_exe_path)
    except Exception as e:
        print(f"Note: Could not auto-populate ffmpeg from imageio-ffmpeg: {e}")

if os.path.exists(BIN_DIR) and BIN_DIR not in os.environ.get("PATH", ""):
    os.environ["PATH"] = BIN_DIR + os.pathsep + os.environ.get("PATH", "")

_asr_pipeline = None

def get_asr_pipeline():
    global _asr_pipeline
    if _asr_pipeline is not None:
        return _asr_pipeline
    try:
        from transformers import pipeline
        _asr_pipeline = pipeline(
            "automatic-speech-recognition",
            model="openai/whisper-tiny"
        )
        return _asr_pipeline
    except Exception as e:
        print(f"Failed to load Whisper ASR pipeline: {e}")
        return None

def transcribe_audio(audio_path: str) -> Dict[str, Any]:
    """
    Transcribes audio using Whisper ASR pipeline.
    Reads WAV file using wave and numpy, passing raw audio to Whisper.
    Returns: {"text": str, "chunks": list, "language": str}
    """
    if not audio_path or not os.path.exists(audio_path):
        return {"text": "", "chunks": [], "language": "unknown"}

    try:
        asr = get_asr_pipeline()
        if not asr:
            return {"text": "", "chunks": [], "language": "unknown"}

        # Read WAV directly using standard wave module
        with wave.open(audio_path, "rb") as wf:
            framerate = wf.getframerate()
            n_frames = wf.getnframes()
            if n_frames == 0:
                return {"text": "", "chunks": [], "language": "unknown"}
            raw_data = wf.readframes(n_frames)
            # 16-bit PCM to float32 normalized between -1.0 and 1.0
            audio_np = np.frombuffer(raw_data, dtype=np.int16).astype(np.float32) / 32768.0

        if len(audio_np) < 1600:  # Less than 0.1s
            return {"text": "", "chunks": [], "language": "unknown"}

        # Run Whisper inference in English
        result = asr(
            {"raw": audio_np, "sampling_rate": framerate},
            return_timestamps=True,
            generate_kwargs={"language": "en", "task": "transcribe"}
        )
        raw_text = str(result.get("text", "")).strip()
        # Clean text
        text = raw_text.encode("ascii", "ignore").decode("ascii").strip()
        if not text and raw_text:
            text = raw_text
        chunks = result.get("chunks", [])

        return {
            "text": text,
            "chunks": chunks,
            "language": "en"
        }
    except Exception as e:
        print(f"Error during audio transcription: {e}")
        return {"text": "", "chunks": [], "language": "unknown"}
