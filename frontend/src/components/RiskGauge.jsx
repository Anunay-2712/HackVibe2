import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle, ShieldAlert } from 'lucide-react';

const RiskGauge = ({ score = 50, verdict = 'INCONCLUSIVE', confidence = 0.85, confidenceLabel = 'HIGH', isMock = true }) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Semicircular angle: 0% -> -90 deg (left), 100% -> +90 deg (right)
  const needleAngle = -90 + (normalizedScore / 100) * 180;

  const getVerdictDetails = () => {
    if (verdict?.includes('REAL')) {
      return {
        label: 'LIKELY REAL',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30',
        badgeColor: 'bg-emerald-500/20 text-emerald-300',
        icon: CheckCircle2,
        desc: 'Visual & acoustic markers are consistent with authentic camera captures.'
      };
    }
    if (verdict?.includes('FAKE') || verdict?.includes('MISLEADING')) {
      return {
        label: 'LIKELY FAKE / MISLEADING',
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30',
        badgeColor: 'bg-rose-500/20 text-rose-300',
        icon: XCircle,
        desc: 'High probability of synthetic manipulation, cloning, or false claim.'
      };
    }
    return {
      label: 'INCONCLUSIVE',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      icon: AlertTriangle,
      desc: 'Conflicting or borderline signals detected. Absence of evidence is not proof.'
    };
  };

  const details = getVerdictDetails();
  const Icon = details.icon;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center relative overflow-hidden border border-white/10 glow-cyan">
      {/* Demo Data Badge */}
      {isMock && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
          DEMO DATA
        </div>
      )}

      <span className="text-xs uppercase font-mono tracking-widest text-gray-400 mb-2">Overall Risk Assessment</span>

      {/* SVG Semicircular Speedometer Gauge */}
      <div className="relative w-64 h-36 flex items-end justify-center">
        <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
          <defs>
            {/* Zone Gradients */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored Arc Zones */}
          {/* Green Zone (0 - 35%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 65 35"
            fill="none"
            stroke="#10b981"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Amber Zone (35 - 65%) */}
          <path
            d="M 68 32 A 80 80 0 0 1 132 32"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            opacity="0.85"
          />

          {/* Red Zone (65 - 100%) */}
          <path
            d="M 135 35 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Center Hub */}
          <circle cx="100" cy="100" r="8" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />

          {/* Animated Needle */}
          <g transform={`rotate(${needleAngle} 100 100)`} className="transition-transform duration-1000 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#22d3ee"
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#gaugeGlow)"
            />
            <circle cx="100" cy="28" r="3" fill="#ffffff" />
          </g>
        </svg>

        {/* Center Numeric Risk Score Display */}
        <div className="absolute bottom-0 text-center flex flex-col items-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
            {normalizedScore}%
          </span>
          <span className="text-[10px] uppercase font-mono text-gray-400">Risk Score</span>
        </div>
      </div>

      {/* Zone Tick Labels */}
      <div className="w-60 flex justify-between text-[10px] font-mono text-gray-500 mt-1 mb-4 px-2">
        <span className="text-emerald-400/80">0% REAL</span>
        <span className="text-amber-400/80">35-65%</span>
        <span className="text-rose-400/80">100% FAKE</span>
      </div>

      {/* Big Verdict Label & Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full p-4 rounded-xl border flex items-center justify-between gap-3 ${details.bgColor}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-black/40 ${details.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-base font-bold tracking-wide ${details.color}`}>
              {details.label}
            </div>
            <div className="text-xs text-gray-300">
              {details.desc}
            </div>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] uppercase font-mono text-gray-400">Confidence</span>
          <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${details.badgeColor}`}>
            {confidenceLabel} ({Math.round(confidence * 100)}%)
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskGauge;
