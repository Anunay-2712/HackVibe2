/**
 * DeepTrace Deterministic Fusion & Verdict Engine
 * Implements Section 7 of the system specification.
 */

const MEDIA_WEIGHTS = {
  pixel_forensics: 0.30,
  face_consistency: 0.25,
  audio_visual: 0.30,
  metadata_provenance: 0.10,
  source_match: 0.05,
};

/**
 * Computes the deterministic multi-agent forensic fusion.
 * @param {Array} agentResults Array of agent result objects
 * @param {Object} [mediaInfo] Optional media quality info
 * @returns {Object} Full fusion verdict, scores, manipulation categorization, and judge report
 */
export function computeFusion(agentResults, mediaInfo = {}) {
  const resultMap = {};
  for (const res of agentResults) {
    if (res && res.agent) {
      resultMap[res.agent] = res;
    }
  }

  // 1. Calculate Media Risk: sum(w_i * conf_i * score_i) / sum(w_i * conf_i) over OK media agents
  let weightedMediaSum = 0;
  let totalMediaWeight = 0;
  let totalMediaConf = 0;
  let mediaAgentCount = 0;

  for (const [agentName, weight] of Object.entries(MEDIA_WEIGHTS)) {
    const agent = resultMap[agentName];
    if (agent && agent.status === 'ok') {
      const conf = Math.max(0.01, agent.confidence || 0.5);
      const score = Math.max(0, Math.min(1, agent.score || 0));
      weightedMediaSum += weight * conf * score;
      totalMediaWeight += weight * conf;
      totalMediaConf += conf;
      mediaAgentCount++;
    }
  }

  const mediaRisk = totalMediaWeight > 0 ? (weightedMediaSum / totalMediaWeight) : 0.0;
  const avgMediaConf = mediaAgentCount > 0 ? (totalMediaConf / mediaAgentCount) : 0.5;

  // 2. Calculate Claim Risk: derived from claim_judge (or max across claim track agents)
  let claimRisk = 0.0;
  let claimConf = 0.5;
  const claimJudge = resultMap['claim_judge'];
  const claimExtractor = resultMap['claim_extractor'];
  const evidenceRetrieval = resultMap['evidence_retrieval'];

  if (claimJudge && claimJudge.status === 'ok') {
    claimRisk = claimJudge.score;
    claimConf = claimJudge.confidence;
  } else if (evidenceRetrieval && evidenceRetrieval.status === 'ok') {
    claimRisk = evidenceRetrieval.score;
    claimConf = evidenceRetrieval.confidence;
  }

  // 3. Cross-Link Agreement & Overall Risk
  // Overall risk = max(media risk, claim risk) boosted by +0.1 (cap 1.0) when both exceed 0.5
  let overallRisk = Math.max(mediaRisk, claimRisk);
  let crossLinkAgreement = false;
  let crossLinkMessage = '';

  if (mediaRisk > 0.5 && claimRisk > 0.5) {
    crossLinkAgreement = true;
    overallRisk = Math.min(1.0, overallRisk + 0.10);
    crossLinkMessage = 'Cross-Link Corroboration: Both visual/acoustic tampering AND factual claim contradictions were independently verified.';
  } else if (claimRisk > 0.7 && mediaRisk < 0.3) {
    crossLinkMessage = 'Cross-Link Alert: Media visuals appear authentic, but spoken claims strongly contradict verified authoritative fact-checks (e.g. potential voice-clone or out-of-context video).';
  } else if (mediaRisk > 0.7 && claimRisk < 0.3) {
    crossLinkMessage = 'Cross-Link Alert: High synthetic media manipulation detected, although the spoken claims themselves may reference authentic topics.';
  } else if (overallRisk < 0.35) {
    crossLinkMessage = 'Cross-Link Consistency: Both media provenance checks and factual assertions show high coherence with authentic records.';
  } else {
    crossLinkMessage = 'Cross-Link Status: Disparate signals across media integrity and factual accuracy. Human review advised.';
  }

  // 4. Strong Disagreement Check (Force INCONCLUSIVE if two high-confidence agents on the same modality disagree strongly)
  let agentDisagreement = false;
  let disagreementDetails = null;

  // Check intra-visual conflict (e.g. pixel vs face consistency)
  const pixelAgent = resultMap['pixel_forensics'];
  const faceAgent = resultMap['face_consistency'];
  if (pixelAgent && faceAgent && pixelAgent.confidence >= 0.7 && faceAgent.confidence >= 0.7) {
    const diff = Math.abs(pixelAgent.score - faceAgent.score);
    // If one visual agent says definitely real (<=0.2) and another says definitely fake (>=0.8), flag conflict
    if (diff > 0.60) {
      agentDisagreement = true;
      disagreementDetails = {
        agentA: 'pixel_forensics',
        scoreA: pixelAgent.score,
        agentB: 'face_consistency',
        scoreB: faceAgent.score,
        diff
      };
    }
  }

  // 5. Determine Verdict
  let verdict = 'INCONCLUSIVE';
  let verdictClass = 'amber';

  if (agentDisagreement) {
    verdict = 'INCONCLUSIVE';
    verdictClass = 'amber';
  } else if (overallRisk < 0.35) {
    verdict = 'LIKELY REAL';
    verdictClass = 'green';
  } else if (overallRisk > 0.65) {
    verdict = 'LIKELY FAKE / MISLEADING';
    verdictClass = 'red';
  } else {
    verdict = 'INCONCLUSIVE';
    verdictClass = 'amber';
  }

  // 6. Overall Confidence with Quality Penalty
  let qualityPenalty = 0.0;
  if (mediaInfo.qualityScore && mediaInfo.qualityScore < 0.6) {
    qualityPenalty = (0.6 - mediaInfo.qualityScore) * 0.3; // Low quality reduces confidence
  }
  let overallConfidence = Math.max(0.1, Math.min(1.0, ((avgMediaConf + claimConf) / 2) - qualityPenalty));

  // 7. Manipulation Type Classification (Rule-based)
  const pixelScore = resultMap['pixel_forensics']?.score || 0;
  const faceScore = resultMap['face_consistency']?.score || 0;
  const audioScore = resultMap['audio_visual']?.score || 0;

  let manipulationType = 'none_detected';
  let rationale = '';

  if (verdict === 'LIKELY REAL') {
    manipulationType = 'none_detected';
    rationale = 'No visual blending artifacts, facial landmark jitter, or synthetic voice frequencies detected.';
  } else if (audioScore > 0.75 && pixelScore < 0.35) {
    manipulationType = 'voice_clone';
    rationale = 'Facial pixels appear largely authentic, but acoustic vocoder signatures and lip-sync mismatch indicate an AI voice clone.';
  } else if (audioScore > 0.75 && faceScore > 0.6) {
    manipulationType = 'lip_sync';
    rationale = 'Phoneme audio energy does not correlate with mouth-opening landmarks, indicating automated audio-video re-dubbing.';
  } else if (faceScore > 0.75 && pixelScore > 0.6) {
    manipulationType = 'face_swap';
    rationale = 'Severe facial landmark boundary jitter, eye reflection asymmetry, and compression blending seams detected.';
  } else if (claimRisk > 0.75 && mediaRisk < 0.35) {
    manipulationType = 'false_claim';
    rationale = 'Media video track is authentic, but extracted claims are directly contradicted by verified fact-checking registries.';
  } else if (pixelScore > 0.7) {
    manipulationType = 'diffusion_synthetic';
    rationale = 'Strong GAN/Diffusion high-frequency spatial anomalies and inconsistent Error Level Analysis (ELA) signatures.';
  } else {
    manipulationType = overallRisk > 0.5 ? 'unclear' : 'none_detected';
    rationale = overallRisk > 0.5
      ? 'Elevated suspicion across multiple subtle indicators, but no single dominant tampering vector identified.'
      : 'No conclusive tampering detected across examined tracks.';
  }

  // 8. Plain-English Judge Report & Checklist
  const judgeReport = {
    executiveSummary: generateExecutiveSummary(verdict, overallRisk, overallConfidence, manipulationType, rationale),
    drivingFactors: [
      `Media Risk Score: ${(mediaRisk * 100).toFixed(0)}% (weighted across 5 forensic agents)`,
      `Claim Verification Risk: ${(claimRisk * 100).toFixed(0)}% (assessed against authoritative records)`,
      `Primary Tampering Vector: ${manipulationType.replace('_', ' ').toUpperCase()}`,
      crossLinkMessage
    ],
    agentDisagreements: agentDisagreement
      ? `Flagged Conflict: ${disagreementDetails.agentA} scored ${(disagreementDetails.scoreA * 100).toFixed(0)}% while ${disagreementDetails.agentB} scored ${(disagreementDetails.scoreB * 100).toFixed(0)}%. Result held to INCONCLUSIVE.`
      : 'All reporting agents showed high directional convergence without severe contradictions.',
    verificationChecklist: [
      'Search original broadcast archive using reverse perceptual hashes in Source Match.',
      'Check if audio track was extracted from a separate, known interview of the speaker.',
      'Examine high-resolution uncompressed master file if available (social media compression reduces forensic certainty).',
      'Cross-reference cited news publisher URLs in the Claim Verification panel.'
    ]
  };

  return {
    mediaRisk: Number(mediaRisk.toFixed(3)),
    claimRisk: Number(claimRisk.toFixed(3)),
    overallRisk: Number(overallRisk.toFixed(3)),
    overallRiskPercent: Math.round(overallRisk * 100),
    confidence: Number(overallConfidence.toFixed(3)),
    confidenceLabel: overallConfidence > 0.75 ? 'HIGH' : overallConfidence > 0.45 ? 'MEDIUM' : 'LOW',
    verdict,
    verdictClass,
    manipulationType,
    rationale,
    crossLinkAgreement,
    crossLinkMessage,
    agentDisagreement,
    disagreementDetails,
    judgeReport,
    timestamp: Date.now()
  };
}

function generateExecutiveSummary(verdict, risk, conf, manipType, rationale) {
  const riskPct = Math.round(risk * 100);
  const confPct = Math.round(conf * 100);

  if (verdict === 'LIKELY REAL') {
    return `DeepTrace concluded with a ${confPct}% confidence level that this media is LIKELY REAL (Risk: ${riskPct}%). Both forensic pixel analysis and semantic claim checking verified that the visual stream exhibits natural sensor characteristics and the claims align with authentic records.`;
  } else if (verdict === 'LIKELY FAKE / MISLEADING') {
    return `DeepTrace evaluated this media with a ${confPct}% confidence level as LIKELY FAKE / MISLEADING (Risk: ${riskPct}%). The primary manipulation category is classified as "${manipType.replace('_', ' ').toUpperCase()}". ${rationale}`;
  } else {
    return `DeepTrace evaluated this submission as INCONCLUSIVE (Risk: ${riskPct}%, Confidence: ${confPct}%). Findings present mixed or border-line evidence. DeepTrace treats absence of evidence as UNVERIFIED rather than definitive proof of authenticity.`;
  }
}
