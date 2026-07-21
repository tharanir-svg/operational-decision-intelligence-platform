class ExplanationEngine {

    generate(
        eventContext,
        thresholdDecision,
        riskResult,
        recommendations
    ) {

        const score =
            typeof riskResult === "object"
                ? riskResult.score
                : riskResult;

        const threshold =
            thresholdDecision.action ||
            thresholdDecision.level ||
            "UNKNOWN";

        return {

            summary:
                `Risk score ${score} triggered ${threshold}.`,

            threshold,

            recommendationLevel:
                recommendations.level,

            recommendedActions:
                recommendations.actions,

            inputs:
                eventContext

        };

    }

}

module.exports = ExplanationEngine;