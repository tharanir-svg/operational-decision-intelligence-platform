const KnowledgeLoader =
  require("../knowledge/KnowledgeLoader");

const PolicyEngine =
  require("../policy/PolicyEngine");

const ThresholdEngine =
  require("../engine/ThresholdEngine");

const RiskScoringEngine =
  require("../engine/RiskScoringEngine");

const ExplanationEngine =
  require("../explanation/ExplanationEngine");

class DecisionOrchestrator {

  constructor() {

    const loader =
      new KnowledgeLoader();

    this.kb =
      loader.loadKnowledgeBase();

    this.policyEngine =
      new PolicyEngine(
        this.kb.policies
      );

    this.thresholdEngine =
      new ThresholdEngine(
        this.kb.thresholds
      );

    this.scoringEngine =
      new RiskScoringEngine(
        this.kb.weights,
        this.kb.regions
      );

    this.explanationEngine =
      new ExplanationEngine();

  }

  evaluate(eventContext) {

    // Step 1: Calculate risk score
    const riskScore =
      this.scoringEngine.calculate(
        eventContext
      );

    // Step 2: Determine threshold level (event-type rules first, score fallback)
    const thresholdDecision =
      this.thresholdEngine.evaluate(
        eventContext,
        riskScore
      );

    // Step 3: Evaluate applicable policies
    const policies =
      this.policyEngine.evaluate(
        eventContext
      );

    // Step 4: Generate explanation
    const explanation =
      this.explanationEngine.generate(
        eventContext,
        thresholdDecision,
        riskScore
      );

    return {
      riskScore,
      thresholdDecision,
      policies,
      explanation
    };

  }

}

module.exports =
  DecisionOrchestrator;