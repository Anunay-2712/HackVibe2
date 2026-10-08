import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, CheckSquare, Square, Download, Printer, RotateCcw, Filter, AlertCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JudgeReportView = ({ report, fusion, agents = {}, analysisId }) => {
  const navigate = useNavigate();
  const [filterAgent, setFilterAgent] = useState('all');
  const [checklist, setChecklist] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const toggleCheck = (idx) => {
    setChecklist(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Aggregate all evidence items across all agents
  const allEvidence = [];
  Object.entries(agents).forEach(([agentName, data]) => {
    const res = data.result || {};
    if (res.evidence && Array.isArray(res.evidence)) {
      res.evidence.forEach(item => {
        allEvidence.push({
          agent: agentName,
          label: item.label,
          detail: item.detail,
          timestamp: item.timestamp,
          frameIndex: item.frameIndex
        });
      });
    }
  });

  const filteredEvidence = filterAgent === 'all'
    ? allEvidence
    : allEvidence.filter(e => e.agent === filterAgent);

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      analysisId,
      timestamp: new Date().toISOString(),
      fusion,
      report,
      agents
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `deeptrace_investigation_${analysisId || 'report'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Judge's Executive Synthesis */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 glow-violet">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Autonomous Judge's Forensic Report
            </h3>
            <p className="text-xs text-gray-400">
              Deterministic evidentiary reasoning powered by Gemini & Multi-Agent Fusion
            </p>
          </div>
        </div>

        {/* Executive Narrative */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 text-sm text-gray-200 leading-relaxed mb-6">
          <p>
            {report?.executiveSummary || fusion?.rationale}
          </p>
          {report?.agentDisagreements && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{report.agentDisagreements}</span>
            </div>
          )}
        </div>

        {/* Driving Factors List */}
        <div className="mb-6">
          <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-2 font-semibold">
            Key Evidentiary Drivers:
          </h4>
          <ul className="space-y-2">
            {(report?.drivingFactors || [
              `Media risk weighted score: ${fusion?.overallRiskPercent || 50}%`,
              `Cross-link agreement: ${fusion?.crossLinkMessage}`
            ]).map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 font-mono bg-white/[0.02] p-2 rounded-lg border border-white/5">
                <span className="text-cyan-400 font-bold">›</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to Verify Manually (Checklist) */}
        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-gray-400 mb-3 font-semibold">
            Human Verification Checklist (Recommended Protocol):
          </h4>
          <div className="space-y-2">
            {(report?.verificationChecklist || [
              'Check source reverse-image queries on Google Lens for historical upload dates.',
              'Inspect audio track for acoustic background room reverb inconsistencies.',
              'Cross-check original social media account for official publication statement.'
            ]).map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/5 cursor-pointer select-none transition-colors"
              >
                {checklist[idx] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500 shrink-0" />
                )}
                <span className={`text-xs ${checklist[idx] ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Evidence Audit Trail Log */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Multimodal Evidence Log Table
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Complete traceable record of every timestamped artifact emitted by all 8 agents.
            </p>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="all">All Agents ({allEvidence.length})</option>
              <option value="pixel_forensics">Pixel Forensics</option>
              <option value="face_consistency">Face Geometry</option>
              <option value="audio_visual">Audio-Visual</option>
              <option value="metadata_provenance">Metadata</option>
              <option value="evidence_retrieval">Evidence Retrieval</option>
              <option value="claim_judge">Claim Judge</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/5 text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-2.5 px-4">Agent</th>
                <th className="py-2.5 px-4">Evidence Label</th>
                <th className="py-2.5 px-4">Timestamp / Frame</th>
                <th className="py-2.5 px-4">Findings Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEvidence.map((ev, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-cyan-300">
                    {ev.agent.replace('_', ' ')}
                  </td>
                  <td className="py-2.5 px-4 text-violet-300">
                    {ev.label}
                  </td>
                  <td className="py-2.5 px-4 text-gray-400">
                    {ev.timestamp != null ? `${ev.timestamp.toFixed(1)}s` : ev.frameIndex != null ? `Frame #${ev.frameIndex}` : 'Global'}
                  </td>
                  <td className="py-2.5 px-4 text-gray-300 font-sans text-xs">
                    {ev.detail}
                  </td>
                </tr>
              ))}
              {filteredEvidence.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500 italic">
                    No evidence items matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons & Footer Disclaimer */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-white transition-all hover:border-cyan-400"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Report (JSON)</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-medium text-white transition-all hover:border-violet-400"
          >
            <Printer className="w-4 h-4 text-violet-400" />
            <span>Print Report (PDF)</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-xs font-bold text-white shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze Another Media</span>
        </button>
      </div>

      {/* Mandatory Disclaimer from Hard Rules */}
      <p className="text-center text-[11px] text-gray-500 font-mono max-w-xl mx-auto pt-2">
        Pretrained detectors can fail on novel generators and heavily compressed social video. Treat this investigation as decision support, not legal proof.
      </p>
    </div>
  );
};

export default JudgeReportView;
