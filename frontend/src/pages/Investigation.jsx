import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSSE } from '../hooks/useSSE';
import AgentSwarm from '../components/AgentSwarm';
import RiskGauge from '../components/RiskGauge';
import VerdictCard from '../components/VerdictCard';
import MediaForensicsPanel from '../components/MediaForensicsPanel';
import ClaimVerificationPanel from '../components/ClaimVerificationPanel';
import JudgeReportView from '../components/JudgeReportView';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Layers, Scan, FileText, Gavel, Cpu, RotateCcw, AlertCircle, ArrowLeft } from 'lucide-react';

const Investigation = () => {
  const { id } = useParams();
  const { agents, fusion, report, status, logs } = useSSE(id);
  const [activeTab, setActiveTab] = useState('verdict');
  const [initialData, setInitialData] = useState(null);

  // Also fetch the full analysis record in case page was reloaded
  useEffect(() => {
    if (!id) return;
    fetch(`/api/analyze/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setInitialData(data);
      })
      .catch(err => console.error('Error fetching analysis details', err));
  }, [id]);

  const effectiveFusion = fusion || initialData?.fusion;
  const effectiveReport = report || initialData?.report || effectiveFusion?.judgeReport;
  const isDone = status === 'done' || Boolean(effectiveFusion);

  const tabs = [
    { id: 'verdict', label: 'Executive Verdict', icon: ShieldCheck, badge: isDone ? effectiveFusion?.verdict : null },
    { id: 'media', label: 'Media Forensics', icon: Scan },
    { id: 'claims', label: 'Claim Verification', icon: FileText },
    { id: 'report', label: "Judge's Report", icon: Gavel },
    { id: 'swarm', label: 'Agent Swarm Trace', icon: Cpu },
  ];

  return (
    <div className="px-4 py-8 min-h-[calc(100vh-130px)] flex flex-col max-w-7xl mx-auto w-full">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
            <Link to="/" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Upload
            </Link>
            <span>/</span>
            <span>Case ID: <span className="text-cyan-300 font-bold">{id}</span></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Forensic Misinformation Investigation
            {!isDone && (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            )}
          </h1>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3">
          {isDone ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              INVESTIGATION CONCLUDED
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              SWARM SCANNING IN PROGRESS...
            </div>
          )}

          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-white/5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all shrink-0 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)] font-semibold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md font-bold ${
                  tab.badge.includes('REAL') ? 'bg-emerald-500/30 text-emerald-300' :
                  tab.badge.includes('FAKE') ? 'bg-rose-500/30 text-rose-300' :
                  'bg-amber-500/30 text-amber-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {/* TAB 1: EXECUTIVE VERDICT */}
          {activeTab === 'verdict' && (
            <motion.div
              key="verdict"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {effectiveFusion ? (
                <>
                  {/* Top Row: Speedometer Risk Gauge & Verdict Card */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5">
                      <RiskGauge
                        score={effectiveFusion.overallRiskPercent}
                        verdict={effectiveFusion.verdict}
                        confidence={effectiveFusion.confidence}
                        confidenceLabel={effectiveFusion.confidenceLabel}
                        isMock={true}
                      />
                    </div>
                    <div className="lg:col-span-7">
                      <VerdictCard
                        fusion={effectiveFusion}
                        inputInfo={initialData?.inputInfo}
                      />
                    </div>
                  </div>

                  {/* Highlights Summary Card */}
                  <div className="glass-panel rounded-2xl p-6 border border-white/10 glow-cyan">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Investigation Highlights & Core Findings
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      {effectiveReport?.executiveSummary || effectiveFusion.rationale}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10">
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Media Risk</span>
                        <span className="text-xl font-bold font-mono text-white">
                          {Math.round((effectiveFusion.mediaRisk || 0) * 100)}%
                        </span>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Pixel + Audio + Geometry</span>
                      </div>

                      <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Claim Risk</span>
                        <span className="text-xl font-bold font-mono text-white">
                          {Math.round((effectiveFusion.claimRisk || 0) * 100)}%
                        </span>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Fact-Check Database Match</span>
                      </div>

                      <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Primary Vector</span>
                        <span className="text-sm font-bold font-mono text-cyan-300 truncate block mt-1">
                          {(effectiveFusion.manipulationType || 'none').toUpperCase().replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 space-y-4">
                  <div className="w-12 h-12 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-lg font-bold text-white">Agents are actively investigating...</h3>
                  <p className="text-sm text-gray-400 max-w-md mx-auto">
                    Forensic algorithms across pixel frequency, facial landmarks, speech vocoders, and fact-check tools are compiling findings. The executive verdict will populate immediately.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: MEDIA FORENSICS */}
          {activeTab === 'media' && (
            <motion.div
              key="media"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <MediaForensicsPanel agents={agents} />
            </motion.div>
          )}

          {/* TAB 3: CLAIM VERIFICATION */}
          {activeTab === 'claims' && (
            <motion.div
              key="claims"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ClaimVerificationPanel agents={agents} />
            </motion.div>
          )}

          {/* TAB 4: JUDGE REPORT & AUDIT */}
          {activeTab === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <JudgeReportView
                report={effectiveReport}
                fusion={effectiveFusion}
                agents={agents}
                analysisId={id}
              />
            </motion.div>
          )}

          {/* TAB 5: AGENT SWARM TRACE */}
          {activeTab === 'swarm' && (
            <motion.div
              key="swarm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AgentSwarm agents={agents} logs={logs} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Investigation;
