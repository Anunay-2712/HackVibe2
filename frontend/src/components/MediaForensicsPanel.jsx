import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Scan, Users, FileSearch, Volume2, Search, Sliders, Film } from 'lucide-react';

const MEDIA_AGENT_LABELS = {
  pixel_forensics: { name: 'Pixel Forensics', icon: Scan },
  face_consistency: { name: 'Face Geometry', icon: Users },
  audio_visual: { name: 'Audio & Vocoder', icon: Volume2 },
  metadata_provenance: { name: 'Metadata & EXIF', icon: FileSearch },
  source_match: { name: 'Source Reverse Match', icon: Search }
};

const MediaForensicsPanel = ({ agents = {} }) => {
  const [heatmapOpacity, setHeatmapOpacity] = useState(50);
  const [selectedFrame, setSelectedFrame] = useState(2);

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

  // Simulated frames for timeline filmstrip
  const frames = [
    { idx: 0, time: '00:01', suspicion: 'low', score: 10 },
    { idx: 1, time: '00:03', suspicion: 'low', score: 14 },
    { idx: 2, time: '00:05', suspicion: 'high', score: 88, flagged: 'Anomalous frequency peak' },
    { idx: 3, time: '00:07', suspicion: 'high', score: 92, flagged: 'Lip boundary jitter' },
    { idx: 4, time: '00:09', suspicion: 'med', score: 62 },
    { idx: 5, time: '00:11', suspicion: 'low', score: 20 },
  ];

  const getScoreColor = (score) => {
    if (score < 30) return 'bg-emerald-500 text-emerald-300';
    if (score < 70) return 'bg-amber-500 text-amber-300';
    return 'bg-rose-500 text-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Top Split: Agent Breakdown Bars + Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Score Bars */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4 flex items-center gap-2">
            <Scan className="w-4 h-4 text-cyan-400" />
            Media Agent Signal Levels
          </h3>

          <div className="space-y-4">
            {Object.entries(MEDIA_AGENT_LABELS).map(([key, info]) => {
              const res = agents[key]?.result || { score: 0, confidence: 0, summary: 'Pending' };
              const scorePercent = Math.round((res.score || 0) * 100);
              const confPercent = Math.round((res.confidence || 0) * 100);
              const Icon = info.icon;

              return (
                <div key={key} className="p-3 bg-black/30 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-white">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span>{info.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-gray-400">Conf: {confPercent}%</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getScoreColor(scorePercent)}`}>
                        {scorePercent}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${scorePercent}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${scorePercent < 35 ? 'bg-emerald-500' : scorePercent < 65 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    />
                  </div>

                  <p className="text-[11px] text-gray-400 truncate">
                    {res.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forensic Radar Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-2 w-full text-left">
            Forensic Vector Radar
          </h3>
          <p className="text-xs text-gray-500 mb-4 w-full text-left">
            Multimodal footprint comparison across visual, acoustic, and metadata domains.
          </p>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="agent" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Frame Timeline Filmstrip Strip */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Sampled Frame Timeline Strip
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-mono">1 frame/sec • Cap 32 frames</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {frames.map((frame) => (
            <div
              key={frame.idx}
              onClick={() => setSelectedFrame(frame.idx)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                selectedFrame === frame.idx
                  ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : 'border-white/10 bg-black/40 hover:border-white/20'
              }`}
            >
              <div className="relative aspect-video rounded-lg bg-gray-900 overflow-hidden flex items-center justify-center border border-white/5">
                <span className="text-[10px] font-mono text-gray-600">FRAME #{frame.idx + 1}</span>
                <span className={`absolute top-1 right-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  frame.suspicion === 'high' ? 'bg-rose-500 text-white' : frame.suspicion === 'med' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'
                }`}>
                  {frame.score}%
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">{frame.time}</span>
                <span className={frame.suspicion === 'high' ? 'text-rose-400 font-semibold' : 'text-gray-500'}>
                  {frame.suspicion.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap & Error Level Analysis (ELA) Viewer */}
      <div className="glass-panel rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Error Level Analysis (ELA) & Frequency Heatmap Overlay
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Slide to blend original camera pixels with discrete frequency anomalies and compression artifacts.
            </p>
          </div>

          {/* Opacity Slider */}
          <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
            <span className="text-xs font-mono text-gray-400">Heatmap Blend:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={heatmapOpacity}
              onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer w-28"
            />
            <span className="text-xs font-mono font-bold text-cyan-400 w-8 text-right">{heatmapOpacity}%</span>
          </div>
        </div>

        {/* Heatmap Simulation Box */}
        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
          {/* Base Layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
            <div className="text-center space-y-2 opacity-60">
              <div className="w-20 h-20 rounded-full border border-cyan-400/40 mx-auto flex items-center justify-center">
                <Users className="w-8 h-8 text-cyan-300" />
              </div>
              <p className="text-xs font-mono text-gray-400">Base Frame #{selectedFrame + 1} (Face Crop Region)</p>
            </div>
          </div>

          {/* Overlay Heatmap Layer with variable opacity */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-150"
            style={{
              opacity: heatmapOpacity / 100,
              background: 'radial-gradient(circle at 50% 45%, rgba(239, 68, 68, 0.7) 0%, rgba(245, 158, 11, 0.5) 30%, rgba(34, 211, 238, 0.3) 60%, transparent 80%)'
            }}
          />

          {/* Info overlay */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-gray-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>ELA Inconsistency: 0.14 RMS Delta in Mouth/Jawline boundary</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaForensicsPanel;
