import { useState, useEffect, useRef } from 'react';

// Agent name mapping: server names → display names
const AGENT_NAMES = [
  'pixel_forensics', 'face_consistency', 'metadata_provenance',
  'audio_visual', 'source_match', 'claim_extractor',
  'evidence_retrieval', 'claim_judge'
];

export const useSSE = (analysisId) => {
  const [state, setState] = useState({
    agents: {},
    fusion: null,
    report: null,
    status: 'connecting',
    logs: [],
  });
  const evtSourceRef = useRef(null);

  useEffect(() => {
    if (!analysisId) return;

    // Initialize all agents as 'queued'
    const initialAgents = {};
    AGENT_NAMES.forEach(name => {
      initialAgents[name] = { state: 'queued' };
    });
    setState(prev => ({ ...prev, agents: initialAgents, status: 'running' }));

    const addLog = (type, message) => {
      setState(prev => ({
        ...prev,
        logs: [...prev.logs, { timestamp: Date.now(), type, message }]
      }));
    };

    // Connect to SSE
    const evtSource = new EventSource(`/api/analyze/${analysisId}/stream`);
    evtSourceRef.current = evtSource;

    evtSource.addEventListener('open', () => {
      addLog('info', 'Connected to orchestrator stream.');
    });

    // Listen for named events from the server
    evtSource.addEventListener('agent_done', (event) => {
      try {
        const data = JSON.parse(event.data);
        const { agentName, result } = data;
        setState(prev => ({
          ...prev,
          agents: {
            ...prev.agents,
            [agentName]: { state: 'done', result }
          },
          logs: [...prev.logs, {
            timestamp: Date.now(),
            type: 'done',
            message: `${agentName}: ${result.summary || 'Complete'}`
          }]
        }));
      } catch (e) {
        console.error('Error parsing agent_done event', e);
      }
    });

    evtSource.addEventListener('fusion_done', (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(prev => ({
          ...prev,
          fusion: data,
          status: 'done',
          logs: [...prev.logs, {
            timestamp: Date.now(),
            type: 'done',
            message: `Fusion complete — Verdict: ${data.verdict || 'PENDING'}`
          }]
        }));
      } catch (e) {
        console.error('Error parsing fusion_done event', e);
      }
    });

    evtSource.addEventListener('report_done', (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(prev => ({
          ...prev,
          report: data,
          logs: [...prev.logs, {
            timestamp: Date.now(),
            type: 'done',
            message: 'Judge report generated.'
          }]
        }));
      } catch (e) {
        console.error('Error parsing report_done event', e);
      }
    });

    evtSource.onerror = () => {
      // SSE auto-reconnects. Only log once.
      console.warn('SSE connection issue, browser will auto-reconnect');
    };

    return () => {
      evtSource.close();
    };
  }, [analysisId]);

  return state;
};
