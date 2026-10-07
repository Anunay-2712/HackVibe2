export function computeFusion(agentResults) {
  return {
    mediaRisk: 0.5,
    claimRisk: 0.5,
    overallRisk: 0.5,
    verdict: 'INCONCLUSIVE',
    confidence: 0.5,
    manipulationType: 'unclear',
    rationale: 'Fusion not yet implemented',
    crossLink: null
  };
}
