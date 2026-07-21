const path = require("path");

const KnowledgeLoader = require("../knowledge/KnowledgeLoader");
const RiskScoringEngine = require("../engine/RiskScoringEngine");
const ThresholdEngine = require("../engine/ThresholdEngine");
const PolicyEngine = require("../policy/PolicyEngine");
const RecommendationEngine = require("../engine/RecommendationEngine");
const DecisionTraceEngine = require("../engine/DecisionTraceEngine");
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

        this.traceEngine = new DecisionTraceEngine();

        this.explanationEngine = new ExplanationEngine();

    }

    evaluate(eventContext) {

        // STEP 1
        const riskResult =
            this.riskEngine.calculate(eventContext);

        // STEP 2
        const thresholdDecision =
            this.thresholdEngine.evaluate(
                eventContext,
                riskResult.score
            );

        // STEP 3
        const policies =
            this.policyEngine.evaluate(eventContext);

        // STEP 4
        const recommendations =
            this.recommendationEngine.generate(
                thresholdDecision
            );

        // STEP 5
        const decisionTrace =
            this.traceEngine.generate(
                riskResult,
                thresholdDecision,
                policies,
                recommendations
            );

        // STEP 6
        const explanation =
            this.explanationEngine.generate(
                eventContext,
                thresholdDecision,
                riskResult,
                recommendations
            );

        return {

            riskScore: riskResult,

            thresholdDecision,

            policies,

            recommendedActions: recommendations,

            decisionTrace,

            explanation

        };

    }

}

module.exports = DecisionOrchestrator;