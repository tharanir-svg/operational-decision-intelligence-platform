const RiskScoringEngine =
  require("../engine/RiskScoringEngine");

const ThresholdEngine =
  require("../engine/ThresholdEngine");

const PolicyEngine =
  require("../policy/PolicyEngine");

const ExplanationEngine =
  require("../explanation/ExplanationEngine");

class DecisionOrchestrator {

  constructor() {

    this.riskEngine =
      new RiskScoringEngine();

    this.thresholdEngine =
      new ThresholdEngine();

    this.policyEngine =
      new PolicyEngine();

    this.explanationEngine =
      new ExplanationEngine();
  }

  evaluate(event) {

    const riskScore =
      this.riskEngine.calculate(event);

    const threshold =
      this.thresholdEngine.recommend(
        riskScore
      );

    const policy =
      this.policyEngine.evaluate(event);

    const explanation =
      this.explanationEngine.generate({
        event,
        riskScore,
        threshold,
        policy
      });

    return {
      riskScore,
      threshold,
      policy,
      explanation
    };
  }
}

module.exports =
  DecisionOrchestrator;
