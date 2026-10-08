import React from 'react';
import { motion } from 'framer-motion';
import { GitMerge, Layers, AlertCircle, FileCheck, Info, Sparkles, Volume2, Video } from 'lucide-react';

const MANIPULATION_CONFIG = {
  voice_clone: {
    label: 'Voice Clone Detected',
    icon: Volume2,
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-300',
    description: 'Synthetic vocoder artifacts detected in speech track. Visuals may be genuine footage with cloned audio.'
  },
  face_swap: {
    label: 'Face Swap / Blending Artifacts',
    icon: Video,
    badgeColor: 'bg-red-50 text-red-800 border-red-300',
    description: 'Facial boundary jitter, asymmetrical reflections, or compression seams in focal areas.'
  },
  lip_sync: {
    label: 'Lip-Sync Manipulation',
    icon: Volume2,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    description: 'Acoustic audio energy envelope does not align with visual mouth landmark motion.'
  },
  false_claim: {
    label: 'False / Misleading Claim',
    icon: AlertCircle,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300',
    description: 'Video track appears unaltered, but spoken statements contradict verified fact-checking records.'
  },
  diffusion_synthetic: {
    label: 'AI-Generated Image (Diffusion/GAN)',
    icon: Sparkles,
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-300',
    description: 'Frequency domain anomalies and non-standard Error Level Analysis (ELA) signatures.'
  },
  none_detected: {
    label: 'Authentic / No Tampering',
    icon: FileCheck,
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    description: 'Natural sensor noise, coherent landmark geometry, and claims corroborated by trusted sources.'
  },
  unclear: {
    label: 'Unclear / Borderline Tampering',
    icon: Info,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Ambiguous or conflicting signals across forensic agents.'
  }
};

const VerdictCard = ({ fusion, inputInfo = {} }) => {
  if (!fusion) return null;

  const manipType = fusion.manipulationType || 'unclear';
  const config = MANIPULATION_CONFIG[manipType] || MANIPULATION_CONFIG.unclear;
  const ManipIcon = config.icon;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
      <div>
        {/* Top Header: Manipulation Type */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider font-bold text-[#475569]">
              Primary Classification
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wide ${config.badgeColor}`}>
                <ManipIcon className="w-3.5 h-3.5" />
                {config.label}
              </span>
            </div>
          </div>

          {/* Quick Input Format Tag */}
          {inputInfo?.sample && (
            <span className="px-2.5 py-1 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-xs font-mono font-bold text-[#4F46E5]">
              Sample: {inputInfo.sample}
            </span>
          )}
        </div>

        {/* Executive Rationale */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-[#0F172A] mb-1.5 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4F46E5]" />
            Forensic Rationale
          </h4>
          <p className="text-sm text-[#0F172A] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] font-normal">
            {fusion.rationale}
          </p>
        </div>

        {/* Cross-Link Correlation Banner */}
        <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 mb-4">
          <div className="flex items-center gap-2 text-[#4F46E5] font-bold text-xs mb-1.5">
            <GitMerge className="w-4 h-4" />
            <span>Cross-Link Synthesis (Media Forensics + Claim Verification)</span>
          </div>
          <p className="text-xs text-[#1E293B] leading-relaxed font-medium">
            {fusion.crossLinkMessage}
          </p>
        </div>
      </div>

      {/* Two Risk Pillars: Media vs Claim */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E2E8F0]">
        <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          <span className="text-[11px] uppercase font-mono font-bold text-[#475569] block">
            Media Risk
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-mono font-extrabold text-[#0F172A]">
              {Math.round((fusion.mediaRisk || 0) * 100)}%
            </span>
            <span className="text-[11px] text-[#64748B] font-semibold">Track A</span>
          </div>
        </div>

        <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          <span className="text-[11px] uppercase font-mono font-bold text-[#475569] block">
            Claim Risk
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-mono font-extrabold text-[#0F172A]">
              {Math.round((fusion.claimRisk || 0) * 100)}%
            </span>
            <span className="text-[11px] text-[#64748B] font-semibold">Track B</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerdictCard;
