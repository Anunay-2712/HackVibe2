import os
from dotenv import load_dotenv

load_dotenv()

DEEPFAKE_CLASSIFIER_MODEL = "dima806/deepfake_vs_real_image_detection"
AUDIO_ANTISPOOFING_MODEL = "microsoft/wavlm-base-plus-sv"
WHISPER_MODEL = "base"
YUNET_FACE_MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "face_detection_yunet.onnx")
MOCK_MODE = os.getenv("MOCK_MODE", "true").lower() in ("true", "1", "yes")
