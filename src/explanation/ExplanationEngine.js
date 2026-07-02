class ExplanationEngine {
  generate(eventContext, thresholdDecision, riskScore) {
    return {
      summary: `Risk score ${riskScore} triggered ${thresholdDecision.action}`,
      inputs: eventContext
    };
  }
}

module.exports = ExplanationEngine;
