import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSSE } from '../hooks/useSSE';
import Navbar from '../components/Navbar';
import AgentSwarm from '../components/AgentSwarm';
import RiskGauge from '../components/RiskGauge';
import VerdictCard from '../components/VerdictCard';
import MediaForensicsPanel from '../components/MediaForensicsPanel';
import ClaimVerificationPanel from '../components/ClaimVerificationPanel';
import JudgeReportView from '../components/JudgeReportView';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Layers, Scan, FileText, Gavel, Cpu, RotateCcw, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Investigation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    { id: 'verdict', label: t('investigation.tabOverview', 'Executive Verdict'), icon: ShieldCheck, badge: isDone ? effectiveFusion?.verdict : null },
    { id: 'media', label: t('investigation.tabMedia', 'Media Forensics'), icon: Scan },
    { id: 'claims', label: t('investigation.tabClaims', 'Claim Verification'), icon: FileText },
    { id: 'report', label: t('investigation.tabJudge', "Judge's Report"), icon: Gavel },
    { id: 'swarm', label: 'Agent Swarm Trace', icon: Cpu },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased flex flex-col">
      {/* Top Standard Navbar */}
      <Navbar onStartInvestigation={() => navigate('/')} />

      {/* Main Page Container */}
      <main className="max-w-[1440px] mx-auto px-[32px] py-[28px] w-full flex-1">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#475569] mb-1 font-semibold">
              <Link to="/" className="text-[#4F46E5] hover:underline flex items-center gap-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('investigation.backHome', 'Back to Upload')}
              </Link>
              <span>/</span>
              <span>Case ID: <span className="text-[#0F172A] font-bold">{id}</span></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-3">
              Forensic Misinformation Investigation
              {!isDone && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4F46E5]"></span>
                </span>
              )}
            </h1>
          </div>

          {/* Status Pill & New Analysis Action */}
          <div className="flex items-center gap-3">
            {isDone ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {t('investigation.statusComplete', 'INVESTIGATION CONCLUDED')}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-300 text-xs font-mono font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-ping"></span>
                {t('investigation.statusAnalyzing', 'SWARM SCANNING IN PROGRESS...')}
              </div>
            )}

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#CBD5E1] text-xs font-mono font-bold text-[#0F172A] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#E2E8F0] scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#4F46E5] text-white border border-[#4F46E5] font-bold shadow-sm'
                    : 'bg-white text-[#334155] hover:bg-slate-50 border border-[#CBD5E1]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-md font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.badge.includes('REAL') ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        tab.badge.includes('FAKE') ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        'bg-amber-100 text-amber-800 border border-amber-200'
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
                          isMock={Boolean(initialData?.inputInfo?.sample)}
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
                    <div className="glass-panel rounded-2xl p-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#4F46E5]" />
                        Investigation Highlights & Core Findings
                      </h3>
                      <p className="text-sm text-[#0F172A] leading-relaxed mb-5 font-normal">
                        {effectiveReport?.executiveSummary || effectiveFusion.rationale}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E2E8F0]">
                        <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                          <span className="text-[11px] font-mono text-[#475569] font-bold uppercase block mb-1">
                            Media Risk
                          </span>
                          <span className="text-2xl font-bold font-mono text-[#0F172A]">
                            {Math.round((effectiveFusion.mediaRisk || 0) * 100)}%
                          </span>
                          <span className="text-xs text-[#64748B] block mt-1 font-medium">
                            Pixel + Audio + Geometry
                          </span>
                        </div>

                        <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                          <span className="text-[11px] font-mono text-[#475569] font-bold uppercase block mb-1">
                            Claim Risk
                          </span>
                          <span className="text-2xl font-bold font-mono text-[#0F172A]">
                            {Math.round((effectiveFusion.claimRisk || 0) * 100)}%
                          </span>
                          <span className="text-xs text-[#64748B] block mt-1 font-medium">
                            Fact-Check Database Match
                          </span>
                        </div>

                        <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                          <span className="text-[11px] font-mono text-[#475569] font-bold uppercase block mb-1">
                            Primary Vector
                          </span>
                          <span className="text-base font-bold font-mono text-[#4F46E5] truncate block mt-1">
                            {(effectiveFusion.manipulationType || 'none').toUpperCase().replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
                    <div className="w-12 h-12 border-3 border-indigo-200 border-t-[#4F46E5] rounded-full animate-spin mx-auto"></div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Agents are actively investigating...</h3>
                    <p className="text-sm text-[#475569] max-w-md mx-auto">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <MediaForensicsPanel agents={agents} />
              </motion.div>
            )}

            {/* TAB 3: CLAIM VERIFICATION */}
            {activeTab === 'claims' && (
              <motion.div
                key="claims"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ClaimVerificationPanel agents={agents} />
              </motion.div>
            )}

            {/* TAB 4: JUDGE REPORT & AUDIT */}
            {activeTab === 'report' && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <AgentSwarm agents={agents} logs={logs} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Investigation;
