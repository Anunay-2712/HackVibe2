import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { createAnalysis, getAnalysis, updateAgent, setFusion, setReport, listSamples } from '../store.js';
import { runAllAgents } from '../services/agentRunner.js';
import { computeFusion } from '../services/fusion.js';
import { recordAnalysis } from '../services/statsService.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/', limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB limit

router.post('/', upload.single('file'), (req, res) => {
  const analysisId = uuidv4();
  
  let inputInfo = {};
  let filePath = null;
  let inputType = 'unknown';

  if (req.file) {
    if (!req.file.mimetype.startsWith('video/') && !req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Invalid file type' });
    }
    inputInfo = { file: req.file.originalname, mimetype: req.file.mimetype };
    filePath = req.file.path;
    inputType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
  } else if (req.body && (req.body.text || req.body.url)) {
    inputInfo = { text: req.body.text, url: req.body.url };
    inputType = req.body.text ? 'text' : 'url';
  } else {
    return res.status(400).json({ error: 'No file or valid JSON body provided' });
  }

  createAnalysis(analysisId, inputInfo);

  runAllAgents(analysisId, filePath, inputType, null, (agentName, result) => {
    updateAgent(analysisId, agentName, result);
  }).then((results) => {
    const fusionResult = computeFusion(results);
    setFusion(analysisId, fusionResult);
    if (fusionResult.judgeReport) {
      setReport(analysisId, fusionResult.judgeReport);
    }
    recordAnalysis(fusionResult.verdict, 2.3);
  });

  res.json({ analysisId });
});

router.post('/sample/:name', (req, res) => {
  const sampleName = req.params.name;
  const samples = listSamples();
  const sample = samples.find(s => s.name === sampleName);
  
  if (!sample) {
    return res.status(404).json({ error: 'Sample not found' });
  }

  const analysisId = uuidv4();
  createAnalysis(analysisId, { sample: sampleName });

  runAllAgents(analysisId, null, sample.type, sampleName, (agentName, result) => {
    updateAgent(analysisId, agentName, result);
  }).then((results) => {
    const fusionResult = computeFusion(results);
    setFusion(analysisId, fusionResult);
    if (fusionResult.judgeReport) {
      setReport(analysisId, fusionResult.judgeReport);
    }
    recordAnalysis(fusionResult.verdict, 2.1);
  });

  res.json({ analysisId });
});

router.get('/:id/stream', (req, res) => {
  const analysisId = req.params.id;
  const analysis = getAnalysis(analysisId);

  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  for (const [agentName, result] of Object.entries(analysis.agents)) {
    res.write(`event: agent_done\ndata: ${JSON.stringify({ agentName, result })}\n\n`);
  }
  
  if (analysis.fusion) {
    res.write(`event: fusion_done\ndata: ${JSON.stringify(analysis.fusion)}\n\n`);
  }
  if (analysis.report) {
    res.write(`event: report_done\ndata: ${JSON.stringify(analysis.report)}\n\n`);
  }

  const onAgentDone = (data) => res.write(`event: agent_done\ndata: ${JSON.stringify(data)}\n\n`);
  const onFusionDone = (data) => res.write(`event: fusion_done\ndata: ${JSON.stringify(data)}\n\n`);
  const onReportDone = (data) => res.write(`event: report_done\ndata: ${JSON.stringify(data)}\n\n`);

  analysis.emitter.on('agent_done', onAgentDone);
  analysis.emitter.on('fusion_done', onFusionDone);
  analysis.emitter.on('report_done', onReportDone);

  req.on('close', () => {
    analysis.emitter.off('agent_done', onAgentDone);
    analysis.emitter.off('fusion_done', onFusionDone);
    analysis.emitter.off('report_done', onReportDone);
  });
});

router.get('/:id', (req, res) => {
  const analysis = getAnalysis(req.params.id);
  if (!analysis) {
    return res.status(404).json({ error: 'Analysis not found' });
  }
  const { emitter, ...data } = analysis;
  res.json(data);
});

export default router;
