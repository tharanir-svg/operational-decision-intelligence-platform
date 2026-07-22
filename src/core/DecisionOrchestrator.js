const path = require("path");

const KnowledgeLoader = require("../knowledge/KnowledgeLoader");

const NormalizationEngine = require("../engine/NormalizationEngine");
const RiskScoringEngine = require("../engine/RiskScoringEngine");
const ThresholdEngine = require("../engine/ThresholdEngine");
const PolicyEngine = require("../policy/PolicyEngine");
const RecommendationEngine = require("../engine/RecommendationEngine");
const DecisionTraceEngine = require("../engine/DecisionTraceEngine");
const ExplanationEngine = require("../explanation/ExplanationEngine");

// NEW
const DecisionOverrideEngine = require("./DecisionOverrideEngine");

class DecisionOrchestrator {

    constructor() {

        const loader = new KnowledgeLoader(
            path.join(__dirname, "../../knowledge")
        );

        const kb = loader.loadKnowledgeBase();

        // -----------------------------
        // Engines
        // -----------------------------

        this.normalizationEngine =
            new NormalizationEngine();

        this.riskEngine =
            new RiskScoringEngine(
                kb.weights,
                kb.regions
            );

        this.thresholdEngine =
            new ThresholdEngine(
                kb.thresholds
            );

        this.policyEngine =
            new PolicyEngine(
                kb.policies
            );

        // NEW
        this.overrideEngine =
            new DecisionOverrideEngine(
                kb.overrideRules
            );

        this.recommendationEngine =
            new RecommendationEngine(
                kb.recommendations
            );

        this.traceEngine =
            new DecisionTraceEngine();

        this.explanationEngine =
            new ExplanationEngine();

    }

    evaluate(eventContext) {

        // ===========================================
        // STEP 0
        // Normalize
        // ===========================================

        const normalizedEvent =
            this.normalizationEngine.normalize(
                eventContext
            );

        // ===========================================
        // STEP 1
        // Risk Score
        // ===========================================

        const riskResult =
            this.riskEngine.calculate(
                normalizedEvent
            );

        // ===========================================
        // STEP 2
        // Threshold Decision
        // ===========================================

        const thresholdDecision =
            this.thresholdEngine.evaluate(
                normalizedEvent,
                riskResult.score
            );

        // ===========================================
        // STEP 3
        // Policy Evaluation
        // ===========================================

        const policies =
            this.policyEngine.evaluate(
                normalizedEvent
            );

        // ===========================================
        // STEP 4
        // Decision Override
        // ===========================================

        const overrideDecision =
            this.overrideEngine.evaluate({

                thresholdDecision,

                triggeredPolicies: policies,

                normalizedInput:
                    normalizedEvent

            });

        // ===========================================
        // STEP 5
        // Recommendation
        // ===========================================

        const recommendations =
            this.recommendationEngine.generate(

                overrideDecision,

                normalizedEvent,

                policies

            );

        // ===========================================
        // STEP 6
        // Decision Trace
        // ===========================================

        const decisionTrace =
            this.traceEngine.generate(

                riskResult,

                thresholdDecision,

                overrideDecision,

                policies,

                recommendations

            );

        // ===========================================
        // STEP 7
        // Explanation
        // ===========================================

        const explanation =
            this.explanationEngine.generate(

                normalizedEvent,

                thresholdDecision,

                overrideDecision,

                riskResult,

                recommendations

            );

        // ===========================================
        // Final Response
        // ===========================================

        return {

            originalInput:
                eventContext,

            normalizedInput:
                normalizedEvent,

            riskScore:
                riskResult,

            thresholdDecision,

            overrideDecision,

            policies,

            recommendedActions:
                recommendations,

            decisionTrace,

            explanation

        };

    }

}

module.exports =
    DecisionOrchestrator;