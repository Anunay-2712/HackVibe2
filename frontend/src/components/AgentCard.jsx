import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Users, FileSearch, Volume2, Search, FileText, Database, Gavel, AlertCircle } from 'lucide-react';

const AGENT_CONFIG = {
  pixel_forensics:      { icon: Scan,       label: 'Pixel Forensics' },
  face_consistency:     { icon: Users,      label: 'Face Consistency' },
  metadata_provenance:  { icon: FileSearch,  label: 'Metadata & Provenance' },
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
    queued:    'border-white/10 bg-white/[0.03]',
    analyzing: 'border-cyan-400/50 bg-cyan-900/20 animate-pulse-cyan',
    done:      'border-white/20 bg-white/[0.06]',
    error:     'border-red-500/50 bg-red-900/20',
    skipped:   'border-white/5 bg-black/20',
  };

  const iconColor = {
    queued: 'text-gray-500',
    analyzing: 'text-cyan-400',
    done: 'text-white',
    error: 'text-red-400',
    skipped: 'text-gray-600',
  };

  const getScoreColor = (score) => {
    if (score < 0.3) return 'bg-green-500';
    if (score < 0.7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scorePercent = result?.score != null ? Math.round(result.score * 100) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel rounded-xl p-4 flex flex-col gap-2 transition-all duration-500 border ${stateStyles[state]}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-black/40 ${iconColor[state]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white">{config.label}</h3>
            <span className={`text-xs capitalize ${iconColor[state]}`}>
              {state === 'analyzing' ? '● Analyzing...' : state}
            </span>
          </div>
        </div>
        {result?.mock && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
            MOCK
          </span>
        )}
      </div>

      {/* Done state — show results */}
      {state === 'done' && result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 space-y-2">
          {scorePercent !== null && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Risk Score</span>
                <span>{scorePercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
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
            <div className="text-xs text-gray-500 flex justify-between">
              <span>Confidence</span>
              <span className="font-mono">{Math.round(result.confidence * 100)}%</span>
            </div>
          )}
          {result.summary && (
            <p className="text-xs text-gray-300 line-clamp-2 mt-1 bg-black/20 p-2 rounded border border-white/5">
              {result.summary}
            </p>
          )}
        </motion.div>
      )}

      {/* Error state */}
      {state === 'error' && (
        <div className="flex items-center gap-1 text-xs text-red-400 mt-1 bg-red-950/30 p-2 rounded">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{result?.summary || 'Agent failed to complete analysis'}</span>
        </div>
      )}
    </motion.div>
  );
};

export default AgentCard;
