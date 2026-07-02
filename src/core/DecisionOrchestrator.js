const path             = require("path");
const KnowledgeLoader  = require("../knowledge/KnowledgeLoader");
const RiskScoringEngine = require("../engine/RiskScoringEngine");
const ThresholdEngine  = require("../engine/ThresholdEngine");
const PolicyEngine     = require("../policy/PolicyEngine");
const ExplanationEngine = require("../explanation/ExplanationEngine");

class DecisionOrchestrator {

  constructor() {
    const loader = new KnowledgeLoader(
      path.join(__dirname, "../../knowledge")
    );
    const kb = loader.loadKnowledgeBase();

    this.riskEngine        = new RiskScoringEngine(kb.weights, kb.regions);
    this.thresholdEngine   = new ThresholdEngine(kb.thresholds);
    this.policyEngine      = new PolicyEngine(kb.policies);
    this.explanationEngine = new ExplanationEngine();
  }

  evaluate(eventContext) {
    const riskScore       = this.riskEngine.calculate(eventContext);
    const thresholdDecision = this.thresholdEngine.evaluate(eventContext, riskScore);
    const policies        = this.policyEngine.evaluate(eventContext);
    const explanation     = this.explanationEngine.generate(eventContext, thresholdDecision, riskScore);

    return { riskScore, thresholdDecision, policies, explanation };
  }
}

module.exports = DecisionOrchestrator;
