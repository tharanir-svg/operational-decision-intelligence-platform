class ExplanationEngine {

    generate(
        eventContext,
        thresholdDecision,
        overrideDecision,
        riskResult,
        recommendations
    ) {

        // ------------------------------------
        // Risk Score
        // ------------------------------------

        const score =
            typeof riskResult === "object"
                ? riskResult.score
                : riskResult;

        // ------------------------------------
        // Initial Threshold
        // ------------------------------------

        const initialThreshold =
            thresholdDecision.level ||
            thresholdDecision.action ||
            "UNKNOWN";

        // ------------------------------------
        // Final Decision
        // ------------------------------------

        const finalDecision =
            overrideDecision?.finalDecision ||
            initialThreshold;

        // ------------------------------------
        // Override Details
        // ------------------------------------

        const overridden =
            overrideDecision?.overridden || false;

        const overrideReason =
            overrideDecision?.overrideReason || null;

        // ------------------------------------
        // Human-readable Summary
        // ------------------------------------

        let summary =
            `The incident received a risk score of ${score}. `;

        summary +=
            `The Threshold Engine initially classified the event as ${initialThreshold}. `;

        if (overridden) {

            summary +=
                `The Decision Override Engine upgraded the operational decision to ${finalDecision}`;

            if (overrideReason) {

                summary +=
                    ` based on the "${overrideReason}" rule.`;

            } else {

                summary += ".";

            }

        } else {

            summary +=
                `No override rules were triggered. The final operational decision remains ${finalDecision}.`;

        }

        // ------------------------------------
        // Return
        // ------------------------------------

        return {

            summary,

            riskScore: score,

            initialThreshold,

            finalDecision,

            overridden,

            overrideReason,

            recommendationLevel:
                recommendations.level,

            recommendedActions:
                recommendations.actions,

            inputs: eventContext

        };

    }

}

module.exports = ExplanationEngine;