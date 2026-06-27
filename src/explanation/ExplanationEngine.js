class ExplanationEngine {

  generate(
    eventContext,
    thresholdDecision,
    riskScore
  ) {

    return {
      summary:
        `Risk score ${riskScore} triggered ${thresholdDecision.level}`,
      inputs: eventContext
    };

  }

}

module.exports =
  ExplanationEngine;