import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Users, FileSearch, Volume2, Search, FileText, Database, Gavel, AlertCircle } from 'lucide-react';

const AGENT_CONFIG = {
  pixel_forensics:      { icon: Scan,       label: 'Pixel Forensics' },
  face_consistency:     { icon: Users,      label: 'Face Consistency' },
  metadata_provenance:  { icon: FileSearch,  label: 'Metadata & EXIF' },
  audio_visual:         { icon: Volume2,     label: 'Audio-Visual' },
  source_match:         { icon: Search,      label: 'Source Match' },
  claim_extractor:      { icon: FileText,    label: 'Claim Extractor' },
  evidence_retrieval:   { icon: Database,    label: 'Evidence Retrieval' },
  claim_judge:          { icon: Gavel,       label: 'Claim Judge' },
};

const AgentCard = ({ name, agentState, result }) => {
  const config = AGENT_CONFIG[name] || { icon: Search, label: name };
  const Icon = config.icon;
  const state = agentState || 'queued';

  const stateStyles = {
    queued:    'border-[#E2E8F0] bg-[#F8FAFC]',
    analyzing: 'border-2 border-[#4F46E5] bg-indigo-50/60 shadow-sm',
    done:      'border-[#E2E8F0] bg-white shadow-sm',
    error:     'border-rose-300 bg-rose-50',
    skipped:   'border-[#E2E8F0] bg-slate-50',
  };

  const iconBg = {
    queued: 'bg-slate-200 text-slate-600',
    analyzing: 'bg-indigo-100 text-[#4F46E5]',
    done: 'bg-indigo-50 text-[#4F46E5]',
    error: 'bg-rose-100 text-rose-600',
    skipped: 'bg-slate-200 text-slate-500',
  };

  const getScoreColor = (score) => {
    if (score < 0.3) return 'bg-emerald-500';
    if (score < 0.7) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const scorePercent = result?.score != null ? Math.round(result.score * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 border ${stateStyles[state]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${iconBg[state]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-[#0F172A]">{config.label}</h3>
            <span className={`text-[11px] font-medium capitalize ${state === 'analyzing' ? 'text-[#4F46E5] font-bold' : 'text-[#475569]'}`}>
              {state === 'analyzing' ? '● Analyzing...' : state}
            </span>
          </div>
        </div>
        {result?.mock && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            MOCK
          </span>
        )}
      </div>

      {/* Done state — show results */}
      {state === 'done' && result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 space-y-2">
          {scorePercent !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-[#475569]">Risk Score</span>
                <span className="text-[#0F172A]">{scorePercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercent}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${getScoreColor(result.score)}`}
                />
              </div>
            </div>
          )}
          {result.confidence != null && (
            <div className="text-xs text-[#475569] flex justify-between font-medium">
              <span>Confidence</span>
              <span className="font-mono font-bold text-[#0F172A]">{Math.round(result.confidence * 100)}%</span>
            </div>
          )}
          {result.summary && (
            <p className="text-xs text-[#334155] line-clamp-2 mt-1 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
              {result.summary}
            </p>
          )}
        </motion.div>
      )}

      {/* Error state */}
      {state === 'error' && (
        <div className="flex items-center gap-1.5 text-xs text-rose-700 font-medium mt-1 bg-rose-100/70 p-2 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{result?.summary || 'Agent failed to complete analysis'}</span>
        </div>
      )}
    </motion.div>
  );
};

export default AgentCard;
