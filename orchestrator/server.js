import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import analyzeRouter from './routes/analyze.js';
import { cleanOld, listSamples } from './store.js';
import { getStats } from './services/statsService.js';
import { getNews } from './services/newsService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const IS_MOCK_MODE = process.env.MOCK_MODE === 'true' || process.env.MOCK_MODE === '1';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Proxy generated heatmaps and forensic artifacts to AI Service
app.use('/artifacts', async (req, res) => {
  try {
    const aiRes = await fetch(`${AI_SERVICE_URL}/artifacts${req.url}`);
    if (aiRes.ok) {
      res.setHeader('Content-Type', aiRes.headers.get('content-type') || 'image/png');
      const buffer = await aiRes.arrayBuffer();
      return res.send(Buffer.from(buffer));
    }
  } catch (e) {
    console.warn('Artifact proxy error:', e.message);
  }
  res.status(404).send('Artifact not found');
});

// Routes
app.use('/api/analyze', analyzeRouter);

app.get('/api/samples', (req, res) => {
  res.json(listSamples());
});

// GET /api/news (cached 15 min proxy, country filter)
app.get('/api/news', async (req, res) => {
  try {
    const data = await getNews(req.query.country);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve news feed' });
  }
});

// GET /api/stats (real counters persisted to JSON)
app.get('/api/stats', (req, res) => {
  try {
    const stats = getStats();
    res.json({
      ...stats,
      mock_mode: IS_MOCK_MODE
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read system stats' });
  }
});

// GET /api/health
app.get('/api/health', async (req, res) => {
  let aiServiceOnline = false;
  try {
    const aiRes = await fetch(`${AI_SERVICE_URL}/health`);
    if (aiRes.ok) aiServiceOnline = true;
  } catch (e) {
    aiServiceOnline = false;
  }

  res.json({
    status: 'ok',
    mock_mode: IS_MOCK_MODE,
    orchestrator: 'online',
    ai_service: aiServiceOnline ? 'online' : 'offline',
    agents: {
      pixel: IS_MOCK_MODE ? 'mock' : aiServiceOnline ? 'online' : 'error',
      face: IS_MOCK_MODE ? 'mock' : aiServiceOnline ? 'online' : 'error',
      audio: IS_MOCK_MODE ? 'mock' : aiServiceOnline ? 'online' : 'error',
      metadata: IS_MOCK_MODE ? 'mock' : aiServiceOnline ? 'online' : 'error',
      claims: IS_MOCK_MODE ? 'mock' : aiServiceOnline ? 'online' : 'error',
      judge: IS_MOCK_MODE ? 'mock' : aiServiceOnline ? 'online' : 'error',
    }
  });
});

const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/artifacts') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`DeepTrace Orchestrator listening on port ${PORT}`);
});

setInterval(() => {
  cleanOld();
}, 60 * 60 * 1000); // Clean old analyses every hour
