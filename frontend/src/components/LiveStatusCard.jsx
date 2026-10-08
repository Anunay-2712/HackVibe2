import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const AGENTS_LIST = [
  { key: 'pixel', label: 'Pixel' },
  { key: 'face', label: 'Face' },
  { key: 'audio', label: 'Audio' },
  { key: 'metadata', label: 'Metadata' },
  { key: 'claims', label: 'Claims' },
  { key: 'judge', label: 'Judge' }
];

const LiveStatusCard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Poll stats and health every 10s
  useEffect(() => {
    let timer;
    let secondsTimer;

    const fetchStatus = async () => {
      try {
        const [statsRes, healthRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/health')
        ]);

        if (statsRes.ok && healthRes.ok) {
          const statsData = await statsRes.json();
          const healthData = await healthRes.json();
          setStats(statsData);
          setHealth(healthData);
          setIsOffline(false);
          setSecondsAgo(0);
        } else {
          setIsOffline(true);
        }
      } catch (err) {
        setIsOffline(true);
      }
    };

    fetchStatus();
    timer = setInterval(fetchStatus, 10000);
    secondsTimer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(secondsTimer);
    };
  }, []);

  const isMockMode = health?.mock_mode === true || stats?.mock_mode === true;

  // Real or initial count calculations
  const analysesToday = stats?.analysesToday ?? 0;
  const avgTime = stats?.avgTime ?? '2.1s';
  const realCount = stats?.verdictMix?.real ?? 0;
  const inconclusiveCount = stats?.verdictMix?.inconclusive ?? 0;
  const fakeCount = stats?.verdictMix?.fake ?? 0;
  const totalVerdicts = realCount + inconclusiveCount + fakeCount;

  const realPct = totalVerdicts > 0 ? (realCount / totalVerdicts) * 100 : 33.3;
  const inconclPct = totalVerdicts > 0 ? (inconclusiveCount / totalVerdicts) * 100 : 33.3;
  const fakePct = totalVerdicts > 0 ? (fakeCount / totalVerdicts) * 100 : 33.4;

  const getAgentStatusColor = (agentKey) => {
    if (isOffline) return 'bg-[#DC2626]'; // red
    if (health?.agents?.[agentKey] === 'error') return 'bg-[#DC2626]';
    if (isMockMode) return 'bg-[#94A3B8]'; // grey for mock mode
    return 'bg-[#16A34A]'; // green for online
  };

  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] p-[18px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
      {/* Header with h3 and right muted "● Updated Xs ago" */}
      <div className="flex items-center justify-between mb-[12px]">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A] m-0">
            {t('sidebar.liveStatusTitle', 'Live system status')}
          </h3>
          {isMockMode && (
            <span className="text-[10px] font-mono font-bold bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] px-1.5 py-0.5 rounded">
              Demo data
            </span>
          )}
        </div>

        <span className="text-[12px] text-[#475569] flex items-center gap-1 font-mono">
          <span
            className={`w-2 h-2 rounded-full inline-block ${
              isOffline ? 'bg-[#DC2626]' : 'bg-[#16A34A]'
            }`}
          />
          {isOffline ? 'Offline' : `${secondsAgo}s ago`}
        </span>
      </div>

      {/* Two stat tiles side by side */}
      <div className="grid grid-cols-2 gap-[10px] mb-[12px]">
        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-[10px]">
          <span className="text-[12px] text-[#475569] block mb-1">
            {t('sidebar.analysesToday', 'Analyses today')}
          </span>
          <span className="text-[20px] font-bold text-[#0F172A] font-sans">
            {isOffline ? '—' : analysesToday}
          </span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-[10px]">
          <span className="text-[12px] text-[#475569] block mb-1">
            {t('sidebar.avgTime', 'Avg. time')}
          </span>
          <span className="text-[20px] font-bold text-[#0F172A] font-sans">
            {isOffline ? '—' : avgTime}
          </span>
        </div>
      </div>

      {/* Muted "Verdict mix" label and stacked bar */}
      <div className="mb-[14px]">
        <div className="flex justify-between items-center text-[12px] text-[#475569] mb-[6px]">
          <span>{t('sidebar.verdictMix', 'Verdict mix')}</span>
          {totalVerdicts > 0 && (
            <span className="font-mono text-[11px] text-[#94A3B8]">
              {realCount}R / {inconclusiveCount}I / {fakeCount}F
            </span>
          )}
        </div>

        <div className="h-[10px] rounded-full overflow-hidden flex w-full bg-[#E2E8F0]" role="progressbar" aria-label="Verdict distribution">
          <div
            style={{ width: `${realPct}%` }}
            className="bg-[#16A34A] h-full transition-all"
            title={`Real: ${Math.round(realPct)}%`}
          />
          <div
            style={{ width: `${inconclPct}%` }}
            className="bg-[#F59E0B] h-full transition-all"
            title={`Inconclusive: ${Math.round(inconclPct)}%`}
          />
          <div
            style={{ width: `${fakePct}%` }}
            className="bg-[#DC2626] h-full transition-all"
            title={`Fake: ${Math.round(fakePct)}%`}
          />
        </div>
      </div>

      {/* Muted "Agent health" label */}
      <div>
        <span className="text-[12px] text-[#475569] block mb-[6px]">
          {t('sidebar.agentHealth', 'Agent health')}
        </span>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] text-[#334155]">
          {AGENTS_LIST.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className={`w-[6px] h-[6px] rounded-full inline-block ${getAgentStatusColor(key)}`}
                aria-hidden="true"
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveStatusCard;
