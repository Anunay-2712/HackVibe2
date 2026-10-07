import os
from dotenv import load_dotenv

load_dotenv()

DEEPFAKE_CLASSIFIER_MODEL = "dima806/deepfake_vs_real_image_detection"
AUDIO_ANTISPOOFING_MODEL = "microsoft/wavlm-base-plus-sv"
WHISPER_MODEL = "base"
MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() in ("true", "1", "yes")
