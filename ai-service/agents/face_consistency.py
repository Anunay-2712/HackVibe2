import os
import cv2
import numpy as np
from typing import Optional, List, Dict, Any
from utils.schema import EvidenceItem
from utils.preprocessing import is_video_file, get_media_info, compute_quality_score, extract_frames
from models_config import YUNET_FACE_MODEL_PATH

_detector = None

def get_face_detector(width: int = 320, height: int = 240):
    global _detector
    if not os.path.exists(YUNET_FACE_MODEL_PATH):
        return None
    try:
        if _detector is None:
            _detector = cv2.FaceDetectorYN_create(
                YUNET_FACE_MODEL_PATH,
                "",
                (width, height),
                score_threshold=0.5,
                nms_threshold=0.3
            )
        else:
            _detector.setInputSize((width, height))
        return _detector
    except Exception as e:
        print(f"Error loading YuNet detector: {e}")
        return None

async def analyze(file_path: Optional[str] = None, sample_name: Optional[str] = None) -> dict:
    # 1. Benchmark sample fast-path if explicitly requested and no real file uploaded
    if sample_name and (not file_path or not os.path.exists(file_path)):
        if sample_name == 'authentic_clip':
            return {
                "score": 0.04,
                "confidence": 0.94,
                "summary": "Facial landmark tracking confirms natural human kinematics. Jitter score: 1.2px (stable).",
                "evidence": [
                    EvidenceItem(label="Landmark Stability", detail="Uniform trajectory across all 6 sampled frames (variance < 0.8).", timestamp=2.0, frameIndex=1),
                    EvidenceItem(label="Ocular Coherence", detail="Natural blink rate and pupil reflection symmetry verified.", timestamp=4.0, frameIndex=3)
                ],
                "artifacts": {
                    "averageJitter": 1.2,
                    "jitterVariance": 0.48,
                    "facesDetectedCount": 6,
                    "totalFrames": 6,
                    "trackingMode": "yunet_landmarks_optical_flow",
                    "sampledFrames": [
                        {"idx": 0, "time": "00:01", "timestamp": 1.0, "suspicion": "low", "score": 6, "url": "/artifacts/frames/sample_authentic/frame_0.jpg", "landmarksDetected": True, "jitterScore": 1.1},
                        {"idx": 1, "time": "00:02", "timestamp": 2.0, "suspicion": "low", "score": 9, "url": "/artifacts/frames/sample_authentic/frame_1.jpg", "landmarksDetected": True, "jitterScore": 1.4},
                        {"idx": 2, "time": "00:03", "timestamp": 3.0, "suspicion": "low", "score": 4, "url": "/artifacts/frames/sample_authentic/frame_2.jpg", "landmarksDetected": True, "jitterScore": 0.9},
                        {"idx": 3, "time": "00:04", "timestamp": 4.0, "suspicion": "low", "score": 8, "url": "/artifacts/frames/sample_authentic/frame_3.jpg", "landmarksDetected": True, "jitterScore": 1.2},
                        {"idx": 4, "time": "00:05", "timestamp": 5.0, "suspicion": "low", "score": 11, "url": "/artifacts/frames/sample_authentic/frame_4.jpg", "landmarksDetected": True, "jitterScore": 1.5},
                        {"idx": 5, "time": "00:06", "timestamp": 6.0, "suspicion": "low", "score": 7, "url": "/artifacts/frames/sample_authentic/frame_5.jpg", "landmarksDetected": True, "jitterScore": 1.0}
                    ]
                },
                "mock": True
            }
        elif sample_name == 'voice_clone_false_claim':
            return {
                "score": 0.06,
                "confidence": 0.92,
                "summary": "Visual track is authentic camera footage. Facial landmarks and motion dynamics show zero visual tampering.",
                "evidence": [
                    EvidenceItem(label="Facial Dynamics", detail="Authentic facial kinematics (average jitter: 1.4px).", timestamp=2.0, frameIndex=1),
                    EvidenceItem(label="Boundary Inspection", detail="No edge blending or warping artifacts along facial perimeter.", timestamp=5.0, frameIndex=4)
                ],
                "artifacts": {
                    "averageJitter": 1.4,
                    "jitterVariance": 0.52,
                    "facesDetectedCount": 6,
                    "totalFrames": 6,
                    "trackingMode": "yunet_landmarks_optical_flow",
                    "sampledFrames": [
                        {"idx": 0, "time": "00:01", "timestamp": 1.0, "suspicion": "low", "score": 8, "url": "/artifacts/frames/sample_voice_clone/frame_0.jpg", "landmarksDetected": True, "jitterScore": 1.3},
                        {"idx": 1, "time": "00:02", "timestamp": 2.0, "suspicion": "low", "score": 10, "url": "/artifacts/frames/sample_voice_clone/frame_1.jpg", "landmarksDetected": True, "jitterScore": 1.5},
                        {"idx": 2, "time": "00:03", "timestamp": 3.0, "suspicion": "low", "score": 6, "url": "/artifacts/frames/sample_voice_clone/frame_2.jpg", "landmarksDetected": True, "jitterScore": 1.1},
                        {"idx": 3, "time": "00:04", "timestamp": 4.0, "suspicion": "low", "score": 9, "url": "/artifacts/frames/sample_voice_clone/frame_3.jpg", "landmarksDetected": True, "jitterScore": 1.4},
                        {"idx": 4, "time": "00:05", "timestamp": 5.0, "suspicion": "low", "score": 7, "url": "/artifacts/frames/sample_voice_clone/frame_4.jpg", "landmarksDetected": True, "jitterScore": 1.2},
                        {"idx": 5, "time": "00:06", "timestamp": 6.0, "suspicion": "low", "score": 8, "url": "/artifacts/frames/sample_voice_clone/frame_5.jpg", "landmarksDetected": True, "jitterScore": 1.3}
                    ]
                },
                "mock": True
            }
        else: # ai_generated_image
            return {
                "score": 0.88,
                "confidence": 0.90,
                "summary": "Facial landmark geometry indicates synthetic generation. Inconsistent corneal reflections and jawline boundary seam.",
                "evidence": [
                    EvidenceItem(label="Corneal Reflection", detail="Asymmetric pupil reflections (>18% specular disparity).", frameIndex=0),
                    EvidenceItem(label="Blending Seam", detail="Unnatural transition and high-frequency discontinuity at jawline.", frameIndex=0)
                ],
                "artifacts": {
                    "averageJitter": 0.0,
                    "jitterVariance": 0.0,
                    "facesDetectedCount": 1,
                    "totalFrames": 1,
                    "trackingMode": "yunet_single_frame",
                    "sampledFrames": [
                        {"idx": 0, "time": "00:00", "timestamp": 0.0, "suspicion": "high", "score": 88, "url": "/artifacts/frames/sample_ai_image/frame_0.jpg", "landmarksDetected": True, "jitterScore": 0.0, "flagged": "Specular disparity & perimeter seam"}
                    ]
                },
                "mock": True
            }

    # 2. Real Forensic Analysis on uploaded file
    if not file_path or not os.path.exists(file_path):
        return {
            "score": 0.5,
            "confidence": 0.1,
            "summary": "No media file provided for face consistency analysis.",
            "evidence": [],
            "artifacts": {},
            "mock": False
        }

    media_info = get_media_info(file_path)
    quality_score = compute_quality_score(media_info)

    # -------------------------------------------------------------------------
    # CASE A: Real Video File Analysis
    # -------------------------------------------------------------------------
    if is_video_file(file_path):
        sampled_meta = extract_frames(file_path, max_frames=32, target_fps=1.0)
        if not sampled_meta:
            return {
                "score": 0.5,
                "confidence": 0.2,
                "summary": "Failed to decode frames from video.",
                "evidence": [EvidenceItem(label="Decode Error", detail="Could not extract video frames.")],
                "artifacts": {},
                "mock": False
            }

        frames_data = []
        face_detect_count = 0
        detector = None

        for meta in sampled_meta:
            frame_img = cv2.imread(meta["path"])
            if frame_img is None:
                continue

            fh, fw = frame_img.shape[:2]
            if detector is None:
                detector = get_face_detector(fw, fh)
            else:
                detector.setInputSize((fw, fh))

            face_found = False
            landmarks = None
            bbox = None

            if detector is not None:
                try:
                    _, faces = detector.detect(frame_img)
                    if faces is not None and len(faces) > 0:
                        face_found = True
                        face_detect_count += 1
                        primary_face = faces[0]
                        bbox = primary_face[0:4].astype(int).tolist()
                        raw_lm = primary_face[4:14].reshape(5, 2)
                        landmarks = raw_lm.tolist()

                        # Draw cyan landmark dots and subtle bounding box for visual timeline
                        annotated = frame_img.copy()
                        bx, by, bw, bh = bbox
                        cv2.rectangle(annotated, (max(0, bx), max(0, by)), (min(fw, bx + bw), min(fh, by + bh)), (238, 211, 34), 1)
                        for lx, ly in raw_lm:
                            cv2.circle(annotated, (int(lx), int(ly)), 3, (238, 211, 34), -1)
                        # Overwrite frame with annotated version
                        cv2.imwrite(meta["path"], annotated, [cv2.IMWRITE_JPEG_QUALITY, 85])
                except Exception as e:
                    print(f"Face detection error on frame: {e}")

            frames_data.append({
                "meta": meta,
                "faceFound": face_found,
                "bbox": bbox,
                "landmarks": landmarks,
                "img": frame_img
            })

        # Calculate Frame-to-Frame Landmark Jitter & Optical Flow
        displacements = []
        accelerations = []
        frame_metrics = []

        for i in range(len(frames_data)):
            cur = frames_data[i]
            cur_jitter = 0.0
            anomaly_flag = None

            if i > 0:
                prev = frames_data[i - 1]
                # If landmarks present in both frames
                if cur["landmarks"] and prev["landmarks"]:
                    cur_lm = np.array(cur["landmarks"])
                    prev_lm = np.array(prev["landmarks"])
                    disp = float(np.mean(np.linalg.norm(cur_lm - prev_lm, axis=1)))
                    displacements.append(disp)

                    # Compute second difference (acceleration / jitter)
                    if len(displacements) >= 2:
                        accel = abs(disp - displacements[-2])
                        accelerations.append(accel)
                        cur_jitter = accel
                    else:
                        cur_jitter = disp
                elif cur["faceFound"] != prev["faceFound"]:
                    # Boundary flickering: face appeared or vanished abruptly
                    cur_jitter = 4.5
                    anomaly_flag = "Facial boundary flicker"
                else:
                    # Sparse optical flow fallback
                    p0 = cv2.goodFeaturesToTrack(cv2.cvtColor(prev["img"], cv2.COLOR_BGR2GRAY), maxCorners=30, qualityLevel=0.01, minDistance=10)
                    if p0 is not None and len(p0) > 0:
                        p1, st, _ = cv2.calcOpticalFlowPyrLK(cv2.cvtColor(prev["img"], cv2.COLOR_BGR2GRAY), cv2.cvtColor(cur["img"], cv2.COLOR_BGR2GRAY), p0, None)
                        if p1 is not None and np.sum(st) > 0:
                            flow_disp = float(np.mean(np.linalg.norm(p1[st == 1] - p0[st == 1], axis=1)))
                            cur_jitter = flow_disp
                    displacements.append(cur_jitter)

            # Categorize frame suspicion
            if cur_jitter > 8.0:
                suspicion = "high"
                f_score = min(95, int(60 + cur_jitter * 3))
                anomaly_flag = anomaly_flag or "Landmark jitter variance spike"
            elif cur_jitter > 3.5:
                suspicion = "med"
                f_score = int(35 + cur_jitter * 4)
            else:
                suspicion = "low"
                f_score = max(5, int(cur_jitter * 5))

            frame_metrics.append({
                "idx": cur["meta"]["frameIndex"],
                "time": cur["meta"]["timeFormatted"],
                "timestamp": cur["meta"]["timestamp"],
                "suspicion": suspicion,
                "score": f_score,
                "url": cur["meta"]["url"],
                "landmarksDetected": cur["faceFound"],
                "jitterScore": round(cur_jitter, 2),
                "flagged": anomaly_flag
            })

        # Video aggregate metrics
        avg_jitter = float(np.mean(displacements)) if displacements else 1.0
        jitter_var = float(np.var(accelerations)) if accelerations else 0.5
        max_jitter = float(np.max(displacements)) if displacements else 1.0
        face_detect_rate = face_detect_count / len(frames_data) if frames_data else 0.0

        # Calibration: normal human movement has acceleration variance < 3.0 and avg jitter < 3.5px
        if jitter_var > 9.0 or max_jitter > 14.0:
            raw_score = min(0.95, 0.65 + (jitter_var / 25.0) * 0.3)
        elif jitter_var < 3.0 and max_jitter < 7.0:
            raw_score = max(0.04, min(0.20, avg_jitter * 0.05))
        else:
            raw_score = min(0.65, max(0.25, 0.20 + (jitter_var / 9.0) * 0.4))

        final_score = round(raw_score, 2)
        confidence = round(min(0.95, max(0.25, quality_score * (0.6 + 0.4 * face_detect_rate))), 2)

        # Generate Evidence Items
        evidence_items = []
        flagged_frames = [f for f in frame_metrics if f["suspicion"] == "high"]
        if flagged_frames:
            for ff in flagged_frames[:3]:
                evidence_items.append(
                    EvidenceItem(
                        label="Landmark Jitter Spike",
                        detail=f"Frame #{ff['idx']} ({ff['time']}): Landmark displacement jitter of {ff['jitterScore']}px exceeds natural kinematic threshold.",
                        timestamp=ff["timestamp"],
                        frameIndex=ff["idx"]
                    )
                )
        else:
            evidence_items.append(
                EvidenceItem(
                    label="Landmark Trajectory",
                    detail=f"Smooth anatomical trajectories across all {len(frame_metrics)} sampled frames (average jitter: {round(avg_jitter, 1)}px).",
                    timestamp=0.0,
                    frameIndex=0
                )
            )

        if face_detect_count == 0:
            evidence_items.append(
                EvidenceItem(
                    label="Face Coverage",
                    detail="No human face recognized in video track; fallback optical flow used.",
                    timestamp=0.0
                )
            )

        summary = (
            f"Tracked facial landmarks across {len(frame_metrics)} frames ({face_detect_count} faces located). "
            f"Average jitter: {round(avg_jitter, 1)}px (variance: {round(jitter_var, 2)}). "
            f"{'Detected unnatural landmark flutter typical of face-swap synthesis.' if final_score > 0.6 else 'Motion kinematics adhere to natural physiological movement.'}"
        )

        return {
            "score": final_score,
            "confidence": confidence,
            "summary": summary,
            "evidence": evidence_items,
            "artifacts": {
                "averageJitter": round(avg_jitter, 2),
                "jitterVariance": round(jitter_var, 2),
                "facesDetectedCount": face_detect_count,
                "totalFrames": len(frame_metrics),
                "trackingMode": "yunet_landmarks_optical_flow",
                "sampledFrames": frame_metrics
            },
            "mock": False
        }

    # -------------------------------------------------------------------------
    # CASE B: Real Image File Analysis
    # -------------------------------------------------------------------------
    img = cv2.imread(file_path)
    if img is None:
        return {
            "score": 0.5,
            "confidence": 0.1,
            "summary": "Could not decode image for face analysis.",
            "evidence": [],
            "artifacts": {},
            "mock": False
        }

    ih, iw = img.shape[:2]
    detector = get_face_detector(iw, ih)
    face_detected = False
    evidence_items = []

    if detector:
        _, faces = detector.detect(img)
        if faces is not None and len(faces) > 0:
            face_detected = True
            primary = faces[0]
            # Analyze eye symmetry and facial proportion
            re_x, re_y = primary[4], primary[5]
            le_x, le_y = primary[6], primary[7]
            eye_tilt = abs(re_y - le_y) / max(1.0, abs(re_x - le_x))
            
            # Subtle deepfake check: abnormal eye slant or blur mismatch
            if eye_tilt > 0.35:
                evidence_items.append(
                    EvidenceItem(label="Facial Asymmetry", detail=f"Excessive bilateral eye tilt ({round(eye_tilt, 2)}) detected in single face.", frameIndex=0)
                )

    final_score = 0.75 if (face_detected and len(evidence_items) > 0) else 0.15
    confidence = round(min(0.95, max(0.3, quality_score * 0.8)), 2)

    return {
        "score": final_score,
        "confidence": confidence,
        "summary": "Single frame facial geometry evaluated via YuNet detector." if face_detected else "No human face detected in image.",
        "evidence": evidence_items,
        "artifacts": {
            "facesDetectedCount": 1 if face_detected else 0,
            "totalFrames": 1,
            "trackingMode": "yunet_single_frame",
            "sampledFrames": [
                {
                    "idx": 0,
                    "time": "00:00",
                    "timestamp": 0.0,
                    "suspicion": "high" if final_score > 0.6 else "low",
                    "score": int(final_score * 100),
                    "landmarksDetected": face_detected,
                    "jitterScore": 0.0
                }
            ]
        },
        "mock": False
    }
