import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Shield, Eye, Volume2, FileCheck2, ArrowRight, 
  HelpCircle, CheckCircle2, AlertTriangle, Layers, Cpu, Compass
} from 'lucide-react';

const AboutModal = ({ isOpen, onClose, onStartInvestigation }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-white border border-[#CBD5E1] rounded-[20px] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] border border-indigo-200 flex items-center justify-center text-[#4F46E5] shadow-sm">
                <Shield className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  About DeepTrace
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-[#4338CA] font-bold">
                    How It Works
                  </span>
                </h2>
                <p className="text-xs text-[#475569]">
                  Demystifying multi-agent media forensics in simple, everyday language.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-6 overflow-y-auto space-y-6 text-[#1E293B] text-sm">
            {/* Plain English Metaphor */}
            <div className="bg-[#EEF2FF]/60 border border-indigo-100 rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-[#4338CA] font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                The Core Idea in 30 Seconds
              </div>
              <p className="text-[#0F172A] leading-relaxed">
                Think of <strong>DeepTrace</strong> like a <strong>digital forensics courtroom</strong>. 
                Instead of trusting a single AI to guess whether something is real or fake, DeepTrace sends your upload to 
                <strong> 8 specialized forensic detectives</strong> at once. Each detective checks a different clue — from subtle pixel flickers and robotic voice patterns to real-world news records.
              </p>
            </div>

            {/* Workflow Diagram */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4 text-[#4F46E5]" />
                Visual Workflow Diagram
              </h3>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 space-y-3">
                {/* Step 1 */}
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                  <div className="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">Upload Anything Suspicious</h4>
                    <p className="text-xs text-[#475569] mt-0.5">
                      Drop a video (MP4/MOV), audio file (MP3/WAV), image (JPG/PNG), or paste a viral message/claim you saw online.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-1 text-slate-300">
                  ↓
                </div>

                {/* Step 2: Parallel 3 Detective Tracks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <div className="bg-white p-3.5 rounded-xl border border-blue-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>The Eye Test</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0F172A] block">Visual & Face Checks</span>
                    <p className="text-[11px] text-[#475569] leading-tight">
                      Looks for unnatural face seams, blinking glitches, or synthetic digital noise that image generators leave behind.
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-purple-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>The Ear Test</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0F172A] block">Voice Clone Checks</span>
                    <p className="text-[11px] text-[#475569] leading-tight">
                      Listens for robotic frequency cut-offs and unnaturally silent pauses common in AI voice clones (ElevenLabs, TTS).
                    </p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>The Truth Test</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0F172A] block">Fact-Checking Registry</span>
                    <p className="text-[11px] text-[#475569] leading-tight">
                      Converts speech to text, extracts key assertions, and searches verified fact-checking databases (Reuters, AP, Poynter).
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-1 text-slate-300">
                  ↓
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                  <div className="w-7 h-7 rounded-full bg-[#EEF2FF] text-[#4F46E5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">Deterministic Fusion (No AI Guessing)</h4>
                    <p className="text-xs text-[#475569] mt-0.5">
                      All detective signals are combined with mathematical weights. If the video looks real but the voice is cloned, our <strong>Cross-Link engine</strong> catches the mismatch.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-1 text-slate-300">
                  ↓
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">Transparent Verdict & Evidence</h4>
                    <p className="text-xs text-[#475569] mt-0.5">
                      You receive a clear verdict: <strong>Likely Real</strong>, <strong>Likely Fake</strong>, or <strong>Inconclusive</strong> — accompanied by visual heatmaps, audio spectrograms, and verifiable source links.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Golden Rule */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wide">
                  Our Ethical Golden Rule: Absence of Evidence Is Not a Lie
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  If an internet claim cannot be corroborated by existing news records, DeepTrace marks it strictly as <strong>UNVERIFIED</strong> rather than falsely declaring it fake. We protect the truth without jumping to false accusations.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-mono">
              DeepTrace • HACKVIBE 2.0
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#475569] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onStartInvestigation) onStartInvestigation();
                }}
                className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Try an Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AboutModal;
