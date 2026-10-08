import React from 'react';
import AgentCard from './AgentCard';
import { Network } from 'lucide-react';
import { motion } from 'framer-motion';

const MEDIA_AGENTS = ['pixel_forensics', 'face_consistency', 'metadata_provenance', 'audio_visual', 'source_match'];
const CLAIM_AGENTS = ['claim_extractor', 'evidence_retrieval', 'claim_judge'];

const AgentSwarm = ({ agents, logs }) => {
  return (
    <div className="w-full flex flex-col gap-6 py-4">
      {/* Central Orchestrator Node */}
      <div className="hidden lg:flex justify-center mb-2">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-[#4F46E5] flex items-center justify-center shadow-md">
            <Network className="w-7 h-7 text-[#4F46E5]" />
          </div>
          <span className="mt-2 text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
            Deterministic Fusion Orchestrator
          </span>
        </div>
      </div>

      {/* Media Forensics Track */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2 uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />
          Media Forensics
          <span className="text-xs text-[#475569] font-normal lowercase ml-2 font-mono">
            Track A — is the visual/acoustic media manipulated?
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {MEDIA_AGENTS.map(name => {
            const agentData = agents[name] || {};
            return (
              <AgentCard
                key={name}
                name={name}
                agentState={agentData.state}
                result={agentData.result}
              />
            );
          })}
        </div>
      </div>

      {/* Claim Verification Track */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2 uppercase tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          Claim Verification
          <span className="text-xs text-[#475569] font-normal lowercase ml-2 font-mono">
            Track B — are the spoken or asserted statements refuted?
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {CLAIM_AGENTS.map(name => {
            const agentData = agents[name] || {};
            return (
              <AgentCard
                key={name}
                name={name}
                agentState={agentData.state}
                result={agentData.result}
              />
            );
          })}
        </div>
      </div>

      {/* Live Log Ticker */}
      <div className="glass-panel rounded-xl p-4 bg-slate-900 text-white h-36 overflow-hidden relative shadow-inner">
        <div className="text-[11px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>Swarm Execution Stream</span>
          <span className="text-emerald-400">● LIVE</span>
        </div>
        <div className="flex flex-col justify-end h-24 font-mono text-xs overflow-y-auto pb-1 space-y-1">
          {logs.length === 0 && (
            <div className="text-slate-500 italic">Waiting for agents to start...</div>
          )}
          {logs.map((log, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className="py-0.5 flex gap-3 text-xs"
            >
              <span className="text-slate-500 shrink-0">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span className={
                log.type === 'error' ? 'text-rose-400 font-semibold' :
                log.type === 'done' ? 'text-emerald-400 font-semibold' :
                'text-indigo-300'
              }>
                {log.message}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSwarm;
