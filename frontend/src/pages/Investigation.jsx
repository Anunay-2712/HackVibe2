import React from 'react';
import { useParams } from 'react-router-dom';
import { useSSE } from '../hooks/useSSE';
import AgentSwarm from '../components/AgentSwarm';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Investigation = () => {
  const { id } = useParams();
  const { agents, logs, status } = useSSE(id);

  return (
    <div className="px-4 py-8 min-h-[calc(100vh-130px)] flex flex-col">
      <div className="max-w-6xl mx-auto w-full mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Active Investigation</h1>
          <p className="text-gray-400 font-mono text-sm flex items-center gap-2">
            ID: {id} 
            {status === 'running' && <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>}
          </p>
        </div>
        
        {status === 'done' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30"
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Analysis Complete</span>
          </motion.div>
        )}
      </div>

      <div className="flex-1">
        <AgentSwarm agents={agents} logs={logs} />
      </div>
      
      {status === 'done' && (
         <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto w-full mt-8 p-6 glass-panel rounded-xl text-center glow-cyan"
         >
           <h2 className="text-2xl font-bold text-gradient mb-4">Phase 2: Comprehensive Dashboard</h2>
           <p className="text-gray-400 mb-6">The detailed forensics report, fusion analysis, and interactive evidence graph will be presented here.</p>
           <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-medium">
             View Raw JSON Output
           </button>
         </motion.div>
      )}
    </div>
  );
};

export default Investigation;
