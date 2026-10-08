import fetch from 'node-fetch';
import path from 'path';

const MEDIA_AGENTS = [
  { name: 'pixel_forensics', track: 'media' },
  { name: 'face_consistency', track: 'media' },
  { name: 'metadata_provenance', track: 'media' },
  { name: 'audio_visual', track: 'media' },
  { name: 'source_match', track: 'media' }
];

const CLAIM_AGENTS = [
  { name: 'claim_extractor', track: 'claim' },
  { name: 'evidence_retrieval', track: 'claim' },
  { name: 'claim_judge', track: 'claim' }
];

async function callAgent(agent, absolutePath, sampleName, inputType, onAgentDone) {
  try {
    const response = await fetch(`http://localhost:8000/agents/${agent.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ file_path: absolutePath, sample_name: sampleName, input_type: inputType })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    onAgentDone(agent.name, result);
    return result;
  } catch (error) {
    const errorResult = {
      agent: agent.name,
      track: agent.track,
      status: 'error',
      score: 0,
      confidence: 0,
      summary: 'Agent failed',
      evidence: [],
      artifacts: {},
      mock: false,
      error: error.message
    };
    onAgentDone(agent.name, errorResult);
    return errorResult;
  }
}

export async function runAllAgents(analysisId, filePath, inputType, sampleName, onAgentDone) {
  const absolutePath = filePath ? path.resolve(filePath) : null;

  // 1. Run all Media agents in parallel
  const mediaPromises = MEDIA_AGENTS.map(agent =>
    callAgent(agent, absolutePath, sampleName, inputType, onAgentDone)
  );

  // 2. Run Claim track agents in pipeline order: extractor -> retrieval -> judge
  const claimPromise = (async () => {
    const claimResults = [];
    for (const agent of CLAIM_AGENTS) {
      const res = await callAgent(agent, absolutePath, sampleName, inputType, onAgentDone);
      claimResults.push(res);
    }
    return claimResults;
  })();

  // Await both tracks to complete
  const [mediaResults, claimResults] = await Promise.all([
    Promise.all(mediaPromises),
    claimPromise
  ]);

  return [...mediaResults, ...claimResults];
}
