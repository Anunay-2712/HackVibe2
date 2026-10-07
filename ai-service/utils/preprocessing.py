import os
from typing import List, Dict, Any, Optional

def extract_frames(video_path: str, max_frames: int = 32) -> List[str]:
    # Phase 1: Mock mode
    return []

def detect_faces(frame_path: str) -> List[str]:
    # Phase 1: Mock mode
    return []

def extract_audio(video_path: str) -> Optional[str]:
    # Phase 1: Mock mode
    return None

def get_media_info(file_path: str) -> Dict[str, Any]:
    # Mock media info
    return {
        "resolution": "1920x1080",
        "bitrate": "5000kbps",
        "codec": "h264",
        "duration": 30.5
    }

def compute_quality_score(media_info: Dict[str, Any]) -> float:
    # Mock quality score
    return 0.9
