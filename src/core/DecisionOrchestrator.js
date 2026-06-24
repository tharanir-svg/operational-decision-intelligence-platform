import KnowledgeLoader from "../knowledge/KnowledgeLoader.js";
import PolicyEngine from "../policy/PolicyEngine.js";
import ThresholdEngine from "../engine/ThresholdEngine.js";
import RiskScoringEngine from "../engine/RiskScoringEngine.js";
import ExplanationEngine from "../explanation/ExplanationEngine.js";

export default class DecisionOrchestrator {
  constructor() {
    const loader = new KnowledgeLoader();

    this.kb = loader.loadKnowledgeBase();

    this.policyEngine = new PolicyEngine(
      this.kb.policies
    );

    this.thresholdEngine = new ThresholdEngine(
      this.kb.thresholds
    );

    this.scoringEngine = new RiskScoringEngine(
      this.kb.weights,
      this.kb.regions
    );

    this.explanationEngine =
      new ExplanationEngine();
  }

  evaluate(eventContext) {
    const policies =
      this.policyEngine.evaluate(eventContext);

    const thresholdDecision =
      this.thresholdEngine.evaluate(eventContext);

    const riskScore =
      this.scoringEngine.calculate(eventContext);

    const explanation =
      this.explanationEngine.generate(
        eventContext,
        thresholdDecision,
        riskScore
      );

    return {
      policies,
      thresholdDecision,
      riskScore,
      explanation
    };
  }
}
