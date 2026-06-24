export default class ExplanationEngine {
  generate(
    eventContext,
    thresholdDecision,
    scoreResult
  ) {
    const reasons = [];

    if (eventContext.fatalities > 0) {
      reasons.push(
        `${eventContext.fatalities} fatalities detected`
      );
    }

    if (eventContext.injuries > 0) {
      reasons.push(
        `${eventContext.injuries} injuries detected`
      );
    }

    reasons.push(
      `Recommended severity ${thresholdDecision.severity}`
    );

    reasons.push(
      `Risk score ${scoreResult.riskScore}`
    );

    return reasons;
  }
}
