import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const RiskGauge = ({ score = 50, verdict = 'INCONCLUSIVE', confidence = 0.85, confidenceLabel = 'HIGH', isMock = true }) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Semicircular angle: 0% -> -90 deg (left), 100% -> +90 deg (right)
  const needleAngle = -90 + (normalizedScore / 100) * 180;

  const getVerdictDetails = () => {
    if (verdict?.includes('REAL')) {
      return {
        label: 'LIKELY REAL',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50 border-emerald-200',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: CheckCircle2,
        desc: 'Visual & acoustic markers are consistent with authentic camera captures.'
      };
    }
    if (verdict?.includes('FAKE') || verdict?.includes('MISLEADING')) {
      return {
        label: 'LIKELY FAKE / MISLEADING',
        color: 'text-rose-700',
        bgColor: 'bg-rose-50 border-rose-200',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        icon: XCircle,
        desc: 'High probability of synthetic manipulation, cloning, or false claim.'
      };
    }
    return {
      label: 'INCONCLUSIVE',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50 border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      desc: 'Conflicting or borderline signals detected. Absence of evidence is not proof.'
    };
  };

  const details = getVerdictDetails();
  const Icon = details.icon;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center relative overflow-hidden">
      {/* Demo Data Badge */}
      {isMock && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          DEMO DATA
        </div>
      )}

      <span className="text-xs uppercase font-mono tracking-widest text-[#475569] font-bold mb-2">
        Overall Risk Assessment
      </span>

      {/* SVG Semicircular Speedometer Gauge */}
      <div className="relative w-64 h-36 flex items-end justify-center">
        <svg viewBox="0 0 200 115" className="w-full h-full overflow-visible">
          {/* Background Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored Arc Zones */}
          {/* Green Zone (0 - 35%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 65 35"
            fill="none"
            stroke="#16A34A"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Amber Zone (35 - 65%) */}
          <path
            d="M 68 32 A 80 80 0 0 1 132 32"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="14"
            opacity="0.9"
          />

          {/* Red Zone (65 - 100%) */}
          <path
            d="M 135 35 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#DC2626"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Center Hub */}
          <circle cx="100" cy="100" r="8" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3" />

          {/* Animated Needle */}
          <g transform={`rotate(${needleAngle} 100 100)`} className="transition-transform duration-1000 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#4F46E5"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="100" cy="28" r="3.5" fill="#4F46E5" />
          </g>
        </svg>

        {/* Center Numeric Risk Score Display */}
        <div className="absolute bottom-0 text-center flex flex-col items-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-[#0F172A]">
            {normalizedScore}%
          </span>
          <span className="text-[11px] uppercase font-mono font-bold text-[#475569]">
            Risk Score
          </span>
        </div>
      </div>

      {/* Zone Tick Labels */}
      <div className="w-60 flex justify-between text-[11px] font-mono font-bold mt-2 mb-4 px-2">
        <span className="text-emerald-700">0% REAL</span>
        <span className="text-amber-700">35-65%</span>
        <span className="text-rose-700">100% FAKE</span>
      </div>

      {/* Big Verdict Label & Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full p-4 rounded-xl border flex items-center justify-between gap-3 ${details.bgColor}`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white shadow-sm ${details.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-base font-extrabold tracking-wide ${details.color}`}>
              {details.label}
            </div>
            <div className="text-xs text-[#334155] font-medium">
              {details.desc}
            </div>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[10px] uppercase font-mono font-bold text-[#475569]">Confidence</span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${details.badgeColor}`}>
            {confidenceLabel} ({Math.round(confidence * 100)}%)
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskGauge;
