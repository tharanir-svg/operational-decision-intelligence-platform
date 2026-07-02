class ThresholdEngine {

  constructor(thresholdMatrix) {
    this.rules = thresholdMatrix.rules || [];
    this.scoreBands = thresholdMatrix.thresholds || [];
  }

  evaluate(eventContext, riskScore) {
    const eventRule = this._matchEventRule(eventContext);
    if (eventRule) {
      return {
        ruleId: eventRule.ruleId,
        action: eventRule.recommendedAction,
        severity: eventRule.recommendedSeverity,
        source: "event-rule"
      };
    }
    return this._evaluateByScore(riskScore);
  }

  _matchEventRule(eventContext) {
    return this.rules.find(rule => {
      if (rule.eventType !== eventContext.eventType) return false;

      const cond = rule.conditions || {};

      if (
        cond.fatalities?.gte !== undefined &&
        (eventContext.fatalities || 0) < cond.fatalities.gte
      ) return false;

      if (
        cond.injuries?.gte !== undefined &&
        (eventContext.injuries || 0) < cond.injuries.gte
      ) return false;

      return true;
    }) || null;
  }

  _evaluateByScore(riskScore) {
    if (this.scoreBands.length) {
      for (const band of this.scoreBands) {
        if (riskScore >= band.minimumScore) {
          return { ...band, source: "score-band" };
        }
      }
    }

    const action =
      riskScore >= 75 ? "FLASH" :
      riskScore >= 50 ? "ESCALATE" :
      riskScore >= 25 ? "WATCH" : "MONITOR";

    const severity =
      riskScore >= 75 ? 5 :
      riskScore >= 50 ? 4 :
      riskScore >= 25 ? 3 : 1;

    return { action, severity, source: "score-band" };
  }
}

module.exports = ThresholdEngine;
