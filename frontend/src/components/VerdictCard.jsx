import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge, Layers, AlertCircle, FileCheck, Info, Sparkles, Volume2, Video, Search } from 'lucide-react';

const MANIPULATION_CONFIG = {
  voice_clone: {
    label: 'Voice Clone Detected',
    icon: Volume2,
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    description: 'Synthetic vocoder artifacts detected in speech track. Visuals may be genuine footage with cloned audio.'
  },
  face_swap: {
    label: 'Face Swap / Blending Artifacts',
    icon: Video,
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    description: 'Facial boundary jitter, asymmetrical reflections, or compression seams in focal areas.'
  },
  lip_sync: {
    label: 'Lip-Sync Manipulation',
    icon: Volume2,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Acoustic audio energy envelope does not align with visual mouth landmark motion.'
  },
  false_claim: {
    label: 'False / Misleading Claim',
    icon: AlertCircle,
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Video track appears unaltered, but spoken statements contradict verified fact-checking records.'
  },
  diffusion_synthetic: {
    label: 'AI-Generated Image (Diffusion/GAN)',
    icon: Sparkles,
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    description: 'Frequency domain anomalies and non-standard Error Level Analysis (ELA) signatures.'
  },
  none_detected: {
    label: 'Authentic / No Tampering',
    icon: FileCheck,
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Natural sensor noise, coherent landmark geometry, and claims corroborated by trusted sources.'
  },
  unclear: {
    label: 'Unclear / Borderline Tampering',
    icon: Info,
    badgeColor: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
    description: 'Ambiguous or conflicting signals across forensic agents.'
  }
};

const VerdictCard = ({ fusion, inputInfo = {} }) => {
  if (!fusion) return null;

  const manipType = fusion.manipulationType || 'unclear';
  const config = MANIPULATION_CONFIG[manipType] || MANIPULATION_CONFIG.unclear;
  const ManipIcon = config.icon;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/10 glow-violet">
      <div>
        {/* Top Header: Manipulation Type */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-gray-400">Primary Classification</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold uppercase tracking-wide ${config.badgeColor}`}>
                <ManipIcon className="w-3.5 h-3.5" />
                {config.label}
              </span>
            </div>
          </div>

          {/* Quick Input Format Tag */}
          {inputInfo?.sample && (
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
              Sample: {inputInfo.sample}
            </span>
          )}
        </div>

        {/* Executive Rationale */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-200 mb-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Forensic Rationale
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">
            {fusion.rationale}
          </p>
        </div>

        {/* Cross-Link Correlation Banner */}
        <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/30 mb-4">
          <div className="flex items-center gap-2 text-violet-300 font-semibold text-xs mb-1.5">
            <GitMerge className="w-4 h-4 text-violet-400" />
            <span>Cross-Link Synthesis (Media Forensics + Claim Verification)</span>
          </div>
          <p className="text-xs text-violet-200/90 leading-relaxed">
            {fusion.crossLinkMessage}
          </p>
        </div>
      </div>

      {/* Two Risk Pillars: Media vs Claim */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
        <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
          <span className="text-[10px] uppercase font-mono text-gray-400 block">Media Risk</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-mono font-bold text-white">
              {Math.round((fusion.mediaRisk || 0) * 100)}%
            </span>
            <span className="text-[10px] text-gray-500">Track A</span>
          </div>
        </div>

        <div className="bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
          <span className="text-[10px] uppercase font-mono text-gray-400 block">Claim Risk</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-mono font-bold text-white">
              {Math.round((fusion.claimRisk || 0) * 100)}%
            </span>
            <span className="text-[10px] text-gray-500">Track B</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerdictCard;
