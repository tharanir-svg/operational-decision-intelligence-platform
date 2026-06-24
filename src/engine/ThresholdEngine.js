class ThresholdEngine {
  constructor(thresholdMatrix) {
    this.thresholdMatrix = thresholdMatrix;
  }

  evaluate(eventContext) {
    const matchingRule = this.thresholdMatrix.rules.find(rule => {
      if (rule.eventType !== eventContext.eventType) {
        return false;
      }

      if (
        rule.conditions?.fatalities?.gte &&
        eventContext.fatalities <
          rule.conditions.fatalities.gte
      ) {
        return false;
      }

      if (
        rule.conditions?.injuries?.gte &&
        eventContext.injuries <
          rule.conditions.injuries.gte
      ) {
        return false;
      }

      return true;
    });

    if (!matchingRule) {
      return {
        severity: 1,
        action: "MONITOR"
      };
    }

    return {
      severity: matchingRule.recommendedSeverity,
      action: matchingRule.recommendedAction
    };
  }
}

module.exports = ThresholdEngine;
