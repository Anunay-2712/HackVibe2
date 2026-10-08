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
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200">
            <Gavel className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
              Autonomous Judge's Forensic Report
            </h3>
            <p className="text-xs text-[#475569]">
              Deterministic evidentiary reasoning powered by Gemini & Multi-Agent Fusion
            </p>
          </div>
        </div>

        {/* Executive Narrative */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3 text-sm text-[#0F172A] leading-relaxed mb-6 font-normal">
          <p>
            {report?.executiveSummary || fusion?.rationale}
          </p>
          {report?.agentDisagreements && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>{report.agentDisagreements}</span>
            </div>
          )}
        </div>

        {/* Driving Factors List */}
        <div className="mb-6">
          <h4 className="text-xs uppercase font-mono tracking-wider text-[#475569] mb-2 font-bold">
            Key Evidentiary Drivers:
          </h4>
          <ul className="space-y-2">
            {(report?.drivingFactors || [
              `Media risk weighted score: ${fusion?.overallRiskPercent || 50}%`,
              `Cross-link agreement: ${fusion?.crossLinkMessage}`
            ]).map((factor, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#0F172A] font-mono font-medium bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                <span className="text-[#4F46E5] font-extrabold">›</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to Verify Manually (Checklist) */}
        <div>
          <h4 className="text-xs uppercase font-mono tracking-wider text-[#475569] mb-3 font-bold">
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
                className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] hover:bg-slate-100 border border-[#CBD5E1] cursor-pointer select-none transition-colors"
              >
                {checklist[idx] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={`text-xs font-medium ${checklist[idx] ? 'text-slate-400 line-through' : 'text-[#0F172A]'}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Evidence Audit Trail Log */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4F46E5]" />
              Multimodal Evidence Log Table
            </h3>
            <p className="text-xs text-[#475569] mt-1 font-normal">
              Complete traceable record of every timestamped artifact emitted by all 8 agents.
            </p>
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#475569]" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] font-bold font-mono focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
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
        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-[#334155] uppercase text-[10px] tracking-wider border-b border-[#CBD5E1]">
              <tr>
                <th className="py-3 px-4 font-bold">Agent</th>
                <th className="py-3 px-4 font-bold">Evidence Label</th>
                <th className="py-3 px-4 font-bold">Timestamp / Frame</th>
                <th className="py-3 px-4 font-bold">Findings Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredEvidence.map((ev, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#4F46E5]">
                    {ev.agent.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#0F172A]">
                    {ev.label}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#475569]">
                    {ev.timestamp != null ? `${ev.timestamp.toFixed(1)}s` : ev.frameIndex != null ? `Frame #${ev.frameIndex}` : 'Global'}
                  </td>
                  <td className="py-3 px-4 text-[#1E293B] font-sans text-xs">
                    {ev.detail}
                  </td>
                </tr>
              ))}
              {filteredEvidence.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-[#64748B] italic">
                    No evidence items matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons & Footer Disclaimer */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-xs font-mono font-bold text-[#0F172A] transition-all hover:border-[#4F46E5] cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#4F46E5]" />
            <span>Download Report (JSON)</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#CBD5E1] text-xs font-mono font-bold text-[#0F172A] transition-all hover:border-indigo-500 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Print Report (PDF)</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-xs font-bold text-white shadow transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Analyze Another Media</span>
        </button>
      </div>

      {/* Mandatory Disclaimer from Hard Rules */}
      <p className="text-center text-[11px] text-[#64748B] font-mono max-w-xl mx-auto pt-2 font-medium">
        Pretrained detectors can fail on novel generators and heavily compressed social video. Treat this investigation as decision support, not legal proof.
      </p>
    </div>
  );
};

export default JudgeReportView;
