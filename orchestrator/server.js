import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import analyzeRouter from './routes/analyze.js';
import { cleanOld, listSamples } from './store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/analyze', analyzeRouter);

app.get('/api/samples', (req, res) => {
  res.json(listSamples());
});

app.listen(PORT, () => {
  console.log(`DeepTrace Orchestrator listening on port ${PORT}`);
});

setInterval(() => {
  cleanOld();
}, 60 * 60 * 1000); // Clean old analyses every hour
