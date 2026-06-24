const path = require("path");
const KnowledgeLoader = require("../knowledge/KnowledgeLoader");
const RiskScoringEngine = require("../engine/RiskScoringEngine");
const ThresholdEngine = require("../engine/ThresholdEngine");
const PolicyEngine = require("../policy/PolicyEngine");
const ExplanationEngine = require("../explanation/ExplanationEngine");

class DecisionOrchestrator {

  constructor() {
    const loader = new KnowledgeLoader(
      path.join(__dirname, "../../knowledge")
    );
    const kb = loader.loadKnowledgeBase();

    this.riskEngine = new RiskScoringEngine(kb.weights, kb.regions);
    this.thresholdEngine = new ThresholdEngine(kb.thresholds);
    this.policyEngine = new PolicyEngine(kb.policies);
    this.explanationEngine = new ExplanationEngine();
  }

  evaluate(event) {
    const scoreResult = this.riskEngine.calculate(event);
    const thresholdDecision = this.thresholdEngine.evaluate(event);
    const applicablePolicies = this.policyEngine.evaluate(event);
    const explanation = this.explanationEngine.generate(
      event,
      thresholdDecision,
      scoreResult
    );

    return {
      riskScore: scoreResult,
      threshold: thresholdDecision,
      policy: applicablePolicies,
      explanation
    };
  }
}

module.exports = DecisionOrchestrator;
