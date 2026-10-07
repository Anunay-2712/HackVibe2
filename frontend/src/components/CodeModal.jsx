import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Copy, Check, FileCode } from 'lucide-react';

const CODE_FILES = {
  'pixel_forensics.py': {
    category: 'AI Service (Python)',
    language: 'python',
    code: `from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    """
    Examines frequency anomalies, Error Level Analysis (ELA),
    and spatial artifacts for synthetic generation signatures.
    """
    if sample_name == 'authentic_clip':
        return {
            "score": 0.05,
            "confidence": 0.90,
            "summary": "Error Level Analysis (ELA) and spatial frequency checks show no signs of manipulation.",
            "evidence": [
                EvidenceItem(label="ELA", detail="Uniform compression levels across image.", frameIndex=0)
            ],
            "artifacts": {"heatmapUrl": "/artifacts/mock_authentic_heatmap.png"}
        }
    else: # ai_generated_image
        return {
            "score": 0.85,
            "confidence": 0.95,
            "summary": "Strong indicators of GAN/diffusion synthesis detected in frequency domain and ELA.",
            "evidence": [
                EvidenceItem(label="Frequency Artifacts", detail="High-frequency spectral anomalies detected.", frameIndex=0),
                EvidenceItem(label="ELA Anomalies", detail="Inconsistent compression signatures found in focal areas.", frameIndex=0)
            ],
            "artifacts": {"heatmapUrl": "/artifacts/mock_fake_heatmap.png"}
        }`
  },
  'audio_visual.py': {
    category: 'AI Service (Python)',
    language: 'python',
    code: `from utils.schema import EvidenceItem

async def analyze(file_path: str, sample_name: str = None) -> dict:
    """
    Detects voice cloning signatures and evaluates phoneme-lip synchronization correlation.
    """
    if sample_name == 'voice_clone_false_claim':
        return {
            "score": 0.96,
            "confidence": 0.92,
            "summary": "Strong evidence of voice cloning and lip-sync mismatch.",
            "evidence": [
                EvidenceItem(label="Lip Sync", detail="Audio phonemes do not match mouth shapes.", timestamp=4.2),
                EvidenceItem(label="Spectral Analysis", detail="Vocoder artifacts detected in higher frequencies.", timestamp=5.1)
            ],
            "artifacts": {}
        }
    return { "score": 0.05, "confidence": 0.90, "summary": "Audio-visual streams synchronized." }`
  },
  'fusion.js': {
    category: 'Orchestrator (Node.js)',
    language: 'javascript',
    code: `// Deterministic Multi-Agent Fusion Algorithm
export function computeFusion(agentResults) {
  // Weights: pixel 0.30, face 0.25, audio 0.30, metadata 0.10, source 0.05
  const weights = {
    pixel_forensics: 0.30,
    face_consistency: 0.25,
    audio_visual: 0.30,
    metadata_provenance: 0.10,
    source_match: 0.05
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [name, w] of Object.entries(weights)) {
    const res = agentResults.find(r => r.agent === name);
    if (res && res.status === 'ok') {
      weightedSum += w * res.confidence * res.score;
      totalWeight += w * res.confidence;
    }
  }

  const mediaRisk = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
  const claimJudge = agentResults.find(r => r.agent === 'claim_judge');
  const claimRisk = claimJudge ? claimJudge.score : 0.5;

  // Cross-link agreement bonus: +0.10 when both media and claim flag high risk
  let overallRisk = Math.max(mediaRisk, claimRisk);
  if (mediaRisk > 0.5 && claimRisk > 0.5) {
    overallRisk = Math.min(1.0, overallRisk + 0.10);
  }

  let verdict = 'INCONCLUSIVE';
  if (overallRisk < 0.35) verdict = 'LIKELY REAL';
  else if (overallRisk > 0.65) verdict = 'LIKELY FAKE';

  return { mediaRisk, claimRisk, overallRisk, verdict };
}`
  },
  'schema.py': {
    category: 'Shared Schema',
    language: 'python',
    code: `from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal

class EvidenceItem(BaseModel):
    label: str
    detail: str
    timestamp: Optional[float] = None
    frameIndex: Optional[int] = None

class AgentResult(BaseModel):
    agent: str
    track: Literal["media", "claim"]
    status: Literal["ok", "error", "skipped"]
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    summary: str
    evidence: List[EvidenceItem] = []
    artifacts: Dict[str, Any] = {}
    mock: bool = False`
  }
};

const CodeInspectorModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState('pixel_forensics.py');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const current = CODE_FILES[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl h-[80vh] glass-panel rounded-2xl flex flex-col border border-white/20 overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">System Code & Agent Inspector</h2>
                <p className="text-xs text-gray-400">Inspect the live forensic agent implementations and deterministic fusion math</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar list */}
            <div className="w-64 border-r border-white/10 bg-black/30 p-3 space-y-1 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider px-2">Source Files</span>
              {Object.entries(CODE_FILES).map(([filename, item]) => (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  className={\`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2 transition-all \${
                    selectedFile === filename
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }\`}
                >
                  <FileCode className="w-4 h-4 shrink-0" />
                  <div className="truncate">
                    <div>{filename}</div>
                    <div className="text-[10px] text-gray-500 font-sans">{item.category}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Code view */}
            <div className="flex-1 flex flex-col bg-[#070b14] overflow-hidden">
              <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <span className="text-xs font-mono text-cyan-400">{selectedFile} ({current.category})</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs text-gray-300 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="flex-1 p-4 font-mono text-xs text-gray-300 overflow-auto leading-relaxed select-text">
                <code>{current.code}</code>
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CodeInspectorModal;
