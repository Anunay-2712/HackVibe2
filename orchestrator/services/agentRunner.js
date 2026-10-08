import fetch from 'node-fetch';
import path from 'path';

const AGENTS = [
  { name: 'pixel_forensics', track: 'media' },
  { name: 'face_consistency', track: 'media' },
  { name: 'metadata_provenance', track: 'media' },
  { name: 'audio_visual', track: 'media' },
  { name: 'source_match', track: 'media' },
  { name: 'claim_extractor', track: 'claim' },
  { name: 'evidence_retrieval', track: 'claim' },
  { name: 'claim_judge', track: 'claim' }
];

export async function runAllAgents(analysisId, filePath, inputType, sampleName, onAgentDone) {
  const absolutePath = filePath ? path.resolve(filePath) : null;
  const agentPromises = AGENTS.map(async (agent) => {
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
  });

  return Promise.all(agentPromises);
}
