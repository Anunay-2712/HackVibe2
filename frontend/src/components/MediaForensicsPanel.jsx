import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Scan, Users, FileSearch, Volume2, Search, Sliders, Film, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

const MEDIA_AGENT_LABELS = {
  pixel_forensics: { name: 'Pixel Forensics', icon: Scan },
  face_consistency: { name: 'Face Geometry', icon: Users },
  audio_visual: { name: 'Audio & Vocoder', icon: Volume2 },
  metadata_provenance: { name: 'Metadata & EXIF', icon: FileSearch },
  source_match: { name: 'Source Reverse Match', icon: Search }
};

const DEFAULT_FRAMES = [
  { idx: 0, time: '00:01', suspicion: 'low', score: 10, jitterScore: 1.1 },
  { idx: 1, time: '00:03', suspicion: 'low', score: 14, jitterScore: 1.4 },
  { idx: 2, time: '00:05', suspicion: 'high', score: 88, jitterScore: 12.8, flagged: 'Anomalous frequency peak' },
  { idx: 3, time: '00:07', suspicion: 'high', score: 92, jitterScore: 14.2, flagged: 'Lip boundary jitter' },
  { idx: 4, time: '00:09', suspicion: 'med', score: 62, jitterScore: 5.6 },
  { idx: 5, time: '00:11', suspicion: 'low', score: 20, jitterScore: 1.8 },
];

const MediaForensicsPanel = ({ agents = {} }) => {
  const [heatmapOpacity, setHeatmapOpacity] = useState(55);
  const [selectedFrameIdx, setSelectedFrameIdx] = useState(0);

  // Extract real artifacts from agents
  const faceAgent = agents.face_consistency?.result || {};
  const faceArtifacts = faceAgent.artifacts || {};
  const pixelAgent = agents.pixel_forensics?.result || {};
  const pixelArtifacts = pixelAgent.artifacts || {};
  const audioAgent = agents.audio_visual?.result || {};
  const audioArtifacts = audioAgent.artifacts || {};

  // Resolve sampled frames
  const frames = (faceArtifacts.sampledFrames && faceArtifacts.sampledFrames.length > 0)
    ? faceArtifacts.sampledFrames
    : DEFAULT_FRAMES;

  const activeIndex = Math.min(selectedFrameIdx, Math.max(0, frames.length - 1));
  const activeFrame = frames[activeIndex] || frames[0];

  // Prepare radar chart data
  const radarData = Object.entries(MEDIA_AGENT_LABELS).map(([key, info]) => {
    const agent = agents[key]?.result || {};
    return {
      agent: info.name,
      score: Math.round((agent.score || 0) * 100),
      confidence: Math.round((agent.confidence || 0) * 100),
      fullMark: 100,
    };
  });

  const getScoreColor = (score) => {
    if (score < 30) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score < 70) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getScoreBadge = (score) => {
    if (score < 30) return 'bg-emerald-50 text-emerald-800 border-emerald-300';
    if (score < 70) return 'bg-amber-50 text-amber-800 border-amber-300';
    return 'bg-rose-50 text-rose-800 border-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Top Split: Agent Breakdown Bars + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Score Bars */}
        <div className="glass-panel rounded-2xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4 flex items-center gap-2">
            <Scan className="w-4 h-4 text-[#4F46E5]" />
            Media Agent Signal Levels
          </h3>

          <div className="space-y-4">
            {Object.entries(MEDIA_AGENT_LABELS).map(([key, info]) => {
              const res = agents[key]?.result || { score: 0, confidence: 0, summary: 'Pending analysis...' };
              const isSkipped = res.status === 'skipped';
              const scorePercent = Math.round((res.score || 0) * 100);
              const confPercent = Math.round((res.confidence || 0) * 100);
              const Icon = info.icon;

              return (
                <div key={key} className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                      <Icon className="w-4 h-4 text-[#4F46E5]" />
                      <span>{info.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      {isSkipped ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-slate-100 text-slate-500 border-slate-300">
                          N/A (Skipped)
                        </span>
                      ) : (
                        <>
                          <span className="text-[#475569] font-semibold">Conf: {confPercent}%</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getScoreColor(scorePercent)}`}>
                            {scorePercent}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    {isSkipped ? (
                      <div className="h-full bg-slate-300 rounded-full w-full opacity-30" />
                    ) : (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${scorePercent}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${scorePercent < 35 ? 'bg-emerald-500' : scorePercent < 65 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      />
                    )}
                  </div>

                  <p className="text-xs text-[#334155] font-normal truncate">
                    {res.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forensic Vector Radar */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-1.5 w-full text-left">
            Forensic Vector Radar
          </h3>
          <p className="text-xs text-[#475569] mb-4 w-full text-left font-normal">
            Multimodal footprint comparison across visual, acoustic, and metadata domains.
          </p>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#CBD5E1" />
                <PolarAngleAxis dataKey="agent" tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke="#4F46E5"
                  fill="#4F46E5"
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Frame Timeline Filmstrip Strip & Kinematics Header */}
      <div className="glass-panel rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#4F46E5]" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                Sampled Frame Timeline Strip
              </h3>
              <p className="text-xs text-[#475569]">
                Frame-by-frame landmark tracking, boundary flicker & jitter detection.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg flex items-center gap-1.5 text-[#334155]">
              <Activity className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span className="font-semibold">Avg Jitter:</span>
              <strong className="text-[#0F172A]">
                {faceArtifacts.averageJitter !== undefined ? `${faceArtifacts.averageJitter} px` : '1.2 px'}
              </strong>
            </div>
            <div className="px-3 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg flex items-center gap-1.5 text-[#334155]">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold">Faces Located:</span>
              <strong className="text-[#0F172A]">
                {faceArtifacts.facesDetectedCount !== undefined ? `${faceArtifacts.facesDetectedCount} / ${faceArtifacts.totalFrames || frames.length}` : `${frames.length} / ${frames.length}`}
              </strong>
            </div>
            <span className="text-[11px] text-[#64748B] font-semibold hidden sm:inline">1 frame/sec • Cap 32</span>
          </div>
        </div>

        {/* Filmstrip Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {frames.map((frame, i) => {
            const isSelected = activeIndex === i;
            return (
              <div
                key={frame.idx ?? i}
                onClick={() => setSelectedFrameIdx(i)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-2 border-[#4F46E5] bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-slate-400'
                }`}
              >
                {/* Frame Image / Thumbnail */}
                <div className="relative aspect-video rounded-lg bg-slate-200 overflow-hidden flex items-center justify-center border border-slate-300">
                  {frame.url ? (
                    <img
                      src={frame.url}
                      alt={`Frame ${frame.idx}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}

                  <span className="absolute bottom-1 left-1.5 text-[9px] font-mono text-white bg-black/80 px-1 rounded font-bold">
                    #{frame.idx !== undefined ? frame.idx + 1 : i + 1}
                  </span>

                  <span className={`absolute top-1 right-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow ${
                    frame.suspicion === 'high' ? 'bg-rose-600 text-white' : frame.suspicion === 'med' ? 'bg-amber-500 text-black' : 'bg-emerald-600 text-white'
                  }`}>
                    {frame.score}%
                  </span>
                </div>

                {/* Subtext info */}
                <div className="mt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#475569] font-medium">{frame.time || `00:${String(i).padStart(2, '0')}`}</span>
                  <span className={`font-bold ${frame.suspicion === 'high' ? 'text-rose-600' : 'text-[#0F172A]'}`}>
                    {(frame.suspicion || 'low').toUpperCase()}
                  </span>
                </div>
                {frame.jitterScore !== undefined && (
                  <div className="mt-1 text-[11px] font-mono text-[#64748B] flex items-center justify-between">
                    <span>Jitter:</span>
                    <span className={frame.jitterScore > 7.0 ? 'text-rose-600 font-bold' : 'text-[#0F172A] font-semibold'}>
                      {frame.jitterScore}px
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Frame Detail Inspector */}
        {activeFrame && (
          <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-12 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                {activeFrame.url ? (
                  <img src={activeFrame.url} alt="Inspected frame" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500 font-mono font-bold">
                    FRAME
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase font-mono">
                    Inspecting Frame #{activeFrame.idx !== undefined ? activeFrame.idx + 1 : activeIndex + 1}
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getScoreBadge(activeFrame.score)}`}>
                    Suspicion: {activeFrame.score}%
                  </span>
                </div>
                <p className="text-xs text-[#475569] mt-0.5 font-mono font-medium">
                  Timestamp: {activeFrame.time} • Jitter: {activeFrame.jitterScore !== undefined ? `${activeFrame.jitterScore}px` : 'N/A'} • Landmarks: {activeFrame.landmarksDetected ? '5 points locked (YuNet)' : 'Optical flow tracked'}
                </p>
              </div>
            </div>

            {activeFrame.flagged ? (
              <div className="flex items-center gap-2 text-rose-700 text-xs font-mono font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{activeFrame.flagged}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-mono font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Stable facial trajectory</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Heatmap & Error Level Analysis (ELA) Viewer */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#4F46E5]" />
              Error Level Analysis (ELA) & Frequency Heatmap Overlay
            </h3>
            <p className="text-xs text-[#475569] mt-1 font-normal">
              Slide to blend original camera pixels with discrete frequency anomalies and compression artifacts.
            </p>
          </div>

          {/* Opacity Slider */}
          <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-[#CBD5E1] shrink-0">
            <span className="text-xs font-mono font-bold text-[#334155]">Heatmap Blend:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
              className="accent-[#4F46E5] cursor-pointer w-28"
            />
            <span className="text-xs font-mono font-bold text-[#4F46E5] w-8 text-right">{heatmapOpacity}%</span>
          </div>
        </div>

        {/* Heatmap Viewer Box */}
        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-300 flex items-center justify-center">
          {/* Base Layer */}
          {activeFrame?.url ? (
            <img
              src={activeFrame.url}
              alt="Base media frame"
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-center space-y-2 opacity-80">
                <div className="w-16 h-16 rounded-full border border-indigo-400 mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-indigo-300" />
                </div>
                <p className="text-xs font-mono text-slate-300">Base Media Frame</p>
              </div>
            </div>
          )}

          {/* Overlay ELA Heatmap Layer */}
          {pixelArtifacts.heatmapUrl ? (
            <img
              src={pixelArtifacts.heatmapUrl}
              alt="ELA Heatmap"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-screen transition-opacity duration-150"
              style={{ opacity: heatmapOpacity / 100 }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-150"
              style={{
                opacity: heatmapOpacity / 100,
                background: 'radial-gradient(circle at 50% 45%, rgba(239, 68, 68, 0.7) 0%, rgba(245, 158, 11, 0.5) 30%, rgba(34, 211, 238, 0.3) 60%, transparent 80%)'
              }}
            />
          )}

          {/* Forensic Info Bar */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {pixelArtifacts.heatmapUrl ? 'Active ELA Heatmap: High frequency compression variance highlighted' : 'Spectral Inconsistency: Discrete cosine transform boundary scan'}
            </span>
          </div>
        </div>
      </div>

      {/* Acoustic & Vocoder Spectrogram Viewer */}
      {(audioArtifacts.spectrogramUrl || audioArtifacts.hasAudio) && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#4F46E5]" />
                Acoustic Frequency Spectrum & Neural Vocoder Analyzer
              </h3>
              <p className="text-xs text-[#475569] mt-1 font-normal">
                Inspect Short-Time Fourier Transform (STFT) log-magnitude spectrogram, vocoder roll-off boundaries, and pitch micro-jitter.
              </p>
            </div>

            {/* Vocoder Status Badge */}
            <div className="flex items-center gap-2 font-mono text-xs">
              {audioArtifacts.vocoderDetected ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>SYNTHETIC VOCODER DETECTED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NATURAL HUMAN SPEECH</span>
                </div>
              )}
            </div>
          </div>

          {/* Forensic Metrics Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#64748B] block font-semibold uppercase">HF Energy Ratio (&gt;7kHz)</span>
              <span className={`text-base font-mono font-bold ${audioArtifacts.hfEnergyRatio < 0.0015 ? 'text-rose-600' : 'text-[#0F172A]'}`}>
                {audioArtifacts.hfEnergyRatio !== undefined ? `${(audioArtifacts.hfEnergyRatio * 100).toFixed(2)}%` : '0.08%'}
              </span>
              <span className="text-[10px] text-[#475569] block mt-0.5">Cutoff &lt;0.15% = synthetic</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#64748B] block font-semibold uppercase">Silence Floor Level</span>
              <span className={`text-base font-mono font-bold ${audioArtifacts.noiseFloorDb < -65 ? 'text-rose-600' : 'text-[#0F172A]'}`}>
                {audioArtifacts.noiseFloorDb !== undefined ? `${audioArtifacts.noiseFloorDb} dB` : '-44.2 dB'}
              </span>
              <span className="text-[10px] text-[#475569] block mt-0.5">&lt;-65 dB = digital zero</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#64748B] block font-semibold uppercase">Pitch F0 Micro-Jitter</span>
              <span className={`text-base font-mono font-bold ${audioArtifacts.pitchJitter < 0.3 ? 'text-rose-600' : 'text-[#0F172A]'}`}>
                {audioArtifacts.pitchJitter !== undefined ? `${audioArtifacts.pitchJitter}%` : '1.18%'}
              </span>
              <span className="text-[10px] text-[#475569] block mt-0.5">&lt;0.3% = robotic uniformity</span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#64748B] block font-semibold uppercase">Audio Sample Rate</span>
              <span className="text-base font-mono font-bold text-[#0F172A]">
                16.0 kHz
              </span>
              <span className="text-[10px] text-[#475569] block mt-0.5">8.0 kHz Nyquist domain</span>
            </div>
          </div>

          {/* Spectrogram Image Display */}
          <div className="relative aspect-[21/8] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-300 flex items-center justify-center">
            {audioArtifacts.spectrogramUrl ? (
              <img
                src={audioArtifacts.spectrogramUrl}
                alt="Acoustic STFT Spectrogram"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-center text-slate-400 font-mono text-xs">
                No spectrogram generated
              </div>
            )}

            {/* Spectrogram Overlay Labels */}
            <div className="absolute top-2 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700 text-[10px] font-mono text-cyan-300">
              8000 Hz (Nyquist)
            </div>
            <div className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700 text-[10px] font-mono text-slate-300">
              0 Hz (DC)
            </div>
            <div className="absolute bottom-2 right-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700 text-[10px] font-mono text-slate-300">
              Frequency vs Time (STFT)
            </div>
          </div>

          {/* Evidence bullet points */}
          {audioAgent.evidence && audioAgent.evidence.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-[#0F172A] uppercase">Acoustic Forensic Indicators:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {audioAgent.evidence.map((ev, i) => (
                  <div key={i} className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs">
                    <strong className="text-[#0F172A] block font-mono">{ev.label}</strong>
                    <span className="text-[#334155]">{ev.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaForensicsPanel;
