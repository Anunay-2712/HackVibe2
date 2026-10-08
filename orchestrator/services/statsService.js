import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATS_FILE = path.join(__dirname, '..', 'stats.json');

const DEFAULT_STATS = {
  analysesToday: 14,
  durations: [2.1, 1.9, 2.4, 2.0],
  avgTime: '2.1s',
  verdictMix: {
    real: 6,
    inconclusive: 3,
    fake: 5
  },
  lastUpdated: new Date().toISOString()
};

export function getStats() {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
      return data;
    }
  } catch (err) {
    console.error('Error reading stats.json', err);
  }
  // Initialize file
  saveStats(DEFAULT_STATS);
  return DEFAULT_STATS;
}

export function saveStats(stats) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving stats.json', err);
  }
}

export function recordAnalysis(verdict, durationSeconds = 2.1) {
  const stats = getStats();
  stats.analysesToday = (stats.analysesToday || 0) + 1;

  if (durationSeconds) {
    stats.durations = stats.durations || [];
    stats.durations.push(durationSeconds);
    if (stats.durations.length > 20) stats.durations.shift();
    const sum = stats.durations.reduce((a, b) => a + b, 0);
    stats.avgTime = (sum / stats.durations.length).toFixed(1) + 's';
  }

  if (verdict) {
    stats.verdictMix = stats.verdictMix || { real: 0, inconclusive: 0, fake: 0 };
    if (verdict.includes('REAL')) stats.verdictMix.real++;
    else if (verdict.includes('FAKE') || verdict.includes('MISLEADING')) stats.verdictMix.fake++;
    else stats.verdictMix.inconclusive++;
  }

  stats.lastUpdated = new Date().toISOString();
  saveStats(stats);
  return stats;
}
