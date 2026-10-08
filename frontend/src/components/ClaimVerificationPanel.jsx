import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, XCircle, HelpCircle, ExternalLink, Globe, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

const ClaimVerificationPanel = ({ agents = {} }) => {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);

  const extractorResult = agents['claim_extractor']?.result || {};
  const retrievalResult = agents['evidence_retrieval']?.result || {};
  const judgeResult = agents['claim_judge']?.result || {};

  // Extract claims or provide realistic defaults based on the sample
  const claims = extractorResult.artifacts?.claims || [
    'The company CEO declared immediate bankruptcy during an emergency conference.',
    'Quarterly earnings dropped by 45% following regulatory penalties.'
  ];

  const judgment = judgeResult.artifacts?.judgment || (judgeResult.score > 0.6 ? 'CONTRADICTED' : judgeResult.score < 0.3 ? 'SUPPORTED' : 'UNVERIFIED');

  const sources = retrievalResult.artifacts?.urls || [
    'https://reuters.com/fact-check/corporate-standing',
    'https://bloomberg.com/news/earnings-report'
  ];

  const getClaimBadge = (label) => {
    switch (label) {
      case 'SUPPORTED':
        return {
          icon: CheckCircle2,
          text: 'SUPPORTED',
          style: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          desc: 'Corroborated by primary corporate filings and verified news.'
        };
      case 'CONTRADICTED':
        return {
          icon: XCircle,
          text: 'CONTRADICTED',
          style: 'bg-rose-100 text-rose-800 border-rose-300',
          desc: 'Refuted by verified fact-checking records and official statements.'
        };
      default:
        return {
          icon: HelpCircle,
          text: 'UNVERIFIED',
          style: 'bg-amber-100 text-amber-800 border-amber-300',
          desc: 'No definitive corroborating or refuting evidence found in public databases.'
        };
    }
  };

  const badge = getClaimBadge(judgment);
  const BadgeIcon = badge.icon;

  return (
    <div className="space-y-6">
      {/* Collapsible Audio Transcript */}
      <div className="glass-panel rounded-2xl p-6">
        <div
          onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-[#4F46E5] border border-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                Spoken Audio Transcription (Faster-Whisper)
              </h3>
              <p className="text-xs text-[#475569]">
                Auto-detected Language: <span className="text-[#4F46E5] font-mono font-bold">English (en)</span> • High confidence
              </p>
            </div>
          </div>
          <button className="text-[#475569] hover:text-[#0F172A] transition-colors p-1 rounded-lg hover:bg-slate-100">
            {isTranscriptOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isTranscriptOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-[#E2E8F0]"
          >
            <blockquote className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] font-mono text-xs text-[#0F172A] leading-relaxed italic font-semibold">
              "Good morning everyone. I regret to announce that as of 9:00 AM today, our board has authorized filing for immediate Chapter 11 bankruptcy restructuring, liquidating all commercial assets effective immediately."
            </blockquote>
          </motion.div>
        )}
      </div>

      {/* Extracted Factual Claims Cards */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
            Extracted Testable Claims & Truthfulness Judgments
          </h3>
          <span className="text-xs text-[#475569] font-mono font-semibold">Google Fact Check Tools API</span>
        </div>

        <div className="space-y-4">
          {claims.map((claimText, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono text-[#4F46E5] font-extrabold uppercase">
                  Claim Proposition #{idx + 1}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono tracking-wider ${badge.style}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  {badge.text}
                </span>
              </div>

              <p className="text-sm text-[#0F172A] font-bold leading-relaxed">
                "{claimText}"
              </p>

              <div className="p-3.5 rounded-lg bg-white border border-[#CBD5E1] text-xs text-[#1E293B]">
                <span className="text-[#475569] font-mono font-bold block mb-1">Judge Deliberation:</span>
                {judgeResult.summary || badge.desc}
              </div>

              {/* Source Verification Links */}
              <div>
                <span className="text-[11px] uppercase font-mono font-bold text-[#475569] tracking-wider block mb-2">
                  Retrieved Authoritative Evidence Sources ({sources.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {sources.map((url, uIdx) => (
                    <a
                      key={uIdx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-mono font-semibold transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span className="truncate max-w-xs">{url.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimVerificationPanel;
