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

        const triggeredOverrides =
    Array.isArray(
        overrideDecision?.triggeredOverrides
    )
        ? overrideDecision.triggeredOverrides
        : [];


if (overridden) {

    summary +=
        `The Decision Override Engine escalated the operational decision to ${finalDecision}`;

    if (overrideReason) {

        summary +=
            ` based on the "${overrideReason}" rule.`;

    } else {

        summary += ".";

    }

} else if (
    triggeredOverrides.length > 0
) {

    const names =
        triggeredOverrides
            .map(
                item =>
                    item.name
            )
            .filter(Boolean)
            .join(", ");

    summary +=
        `Override safeguard${triggeredOverrides.length > 1 ? "s" : ""} ${names ? `"${names}" ` : ""}matched, but no escalation was required because the existing ${initialThreshold} decision was equal or higher. The final operational decision remains ${finalDecision}.`;

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