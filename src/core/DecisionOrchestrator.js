const path = require("path");

const KnowledgeLoader = require("../knowledge/KnowledgeLoader");
const RiskScoringEngine = require("../engine/RiskScoringEngine");
const ThresholdEngine = require("../engine/ThresholdEngine");
const PolicyEngine = require("../policy/PolicyEngine");
const RecommendationEngine = require("../engine/RecommendationEngine");
const ExplanationEngine = require("../explanation/ExplanationEngine");

class DecisionOrchestrator {

    constructor() {

        const loader = new KnowledgeLoader(
            path.join(__dirname, "../../knowledge")
        );

        const kb = loader.loadKnowledgeBase();

        this.riskEngine = new RiskScoringEngine(
            kb.weights,
            kb.regions
        );

        this.thresholdEngine = new ThresholdEngine(
            kb.thresholds
        );

        this.policyEngine = new PolicyEngine(
            kb.policies
        );

        this.recommendationEngine = new RecommendationEngine(
            kb.recommendations
        );

        this.explanationEngine = new ExplanationEngine();

    }

    evaluate(eventContext) {

        // Step 1 - Calculate operational risk
        const riskResult =
            this.riskEngine.calculate(eventContext);

        // Step 2 - Determine operational threshold
        const thresholdDecision =
            this.thresholdEngine.evaluate(
                eventContext,
                riskResult.score
            );

        // Step 3 - Evaluate applicable policies
        const policies =
            this.policyEngine.evaluate(eventContext);

        // Step 4 - Generate operational recommendations
        const recommendations =
            this.recommendationEngine.generate(
                thresholdDecision
            );

        // Step 5 - Generate explanation
        const explanation =
            this.explanationEngine.generate(
                eventContext,
                thresholdDecision,
                riskResult,
                recommendations
            );

        // Step 6 - Return complete operational assessment
        return {

            riskScore: riskResult,

            thresholdDecision,

            policies,

            recommendedActions: recommendations,

            explanation

        };

    }

}

module.exports = DecisionOrchestrator;