const BaseEngine =
    require("./BaseEngine");

const PolicyEvaluationEngine =
    require("../orchestration/PolicyEvaluationEngine");

class RiskFactorEngine
    extends BaseEngine {

    constructor(knowledgeManager) {

        super("RiskFactorEngine");

        this.knowledgeManager =
            knowledgeManager;

        this.evaluator =
            new PolicyEvaluationEngine();

    }

    process(context) {

        if (!context) {
            throw new Error(
                "RiskFactorEngine requires a DecisionContext."
            );
        }

        if (!this.knowledgeManager) {
            throw new Error(
                "RiskFactorEngine requires a KnowledgeManager."
            );
        }

        const library =
            this.knowledgeManager.get(
                "riskFactors"
            );

        if (!library) {

            throw new Error(
                "Risk factor knowledge has not been loaded."
            );

        }

        const factors =
            Array.isArray(library.riskFactors)
                ? library.riskFactors
                : [];

        context.riskFactors = [];

        for (const factor of factors) {

            if (!factor || !factor.rule) {
                continue;
            }

            const matched =
                this.evaluator.matches(
                    factor.rule,
                    context
                );

            if (!matched) {
                continue;
            }

            context.riskFactors.push({

                id:
                    factor.id || "",

                name:
                    factor.name || "Unnamed Risk Factor",

                points:
                    Number(factor.points) || 0,

                reason:
                    factor.reason || "",

                source:
                    "risk-factor-library"

            });

        }

        return context;

    }

}

module.exports =
    RiskFactorEngine;