import React from 'react';
import AgentCard from './AgentCard';
import { Network } from 'lucide-react';
import { motion } from 'framer-motion';

const MEDIA_AGENTS = ['pixel_forensics', 'face_consistency', 'metadata_provenance', 'audio_visual', 'source_match'];
const CLAIM_AGENTS = ['claim_extractor', 'evidence_retrieval', 'claim_judge'];

const AgentSwarm = ({ agents, logs }) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-8 relative">
      {/* Central Orchestrator Node */}
      <div className="hidden lg:flex justify-center mb-4">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-cyan-900/30 border-2 border-cyan-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)] animate-pulse-cyan">
            <Network className="w-8 h-8 text-cyan-400" />
          </div>
          <span className="mt-2 text-sm font-semibold text-cyan-400">Orchestrator</span>
        </div>
      </div>

      {/* Media Forensics Track */}
      <div>
        <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          Media Forensics
          <span className="text-xs text-gray-500 font-normal ml-2">Track A — Is the media manipulated?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      <div>
        <h2 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          Claim Verification
          <span className="text-xs text-gray-500 font-normal ml-2">Track B — Is the message false?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:px-16">
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
      <div className="mt-4 glass-panel rounded-lg p-3 bg-black/60 h-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
        <div className="flex flex-col justify-end h-full font-mono text-xs overflow-y-auto pb-2 space-y-1">
          {logs.length === 0 && (
            <div className="text-gray-600 italic">Waiting for agents to start...</div>
          )}
          {logs.map((log, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className="py-0.5 flex gap-3"
            >
              <span className="text-gray-600 shrink-0">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>
              <span className={
                log.type === 'error' ? 'text-red-400' :
                log.type === 'done' ? 'text-green-400' :
                'text-cyan-300'
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
