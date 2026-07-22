class RecommendationEngine {

    constructor(recommendationLibrary) {

        this.library =
            recommendationLibrary.recommendations || [];

    }

    generate(
        finalDecision,
        normalizedEvent = {},
        triggeredPolicies = []
    ) {

        // -----------------------------
        // Resolve decision level
        // -----------------------------

        let level;

        if (typeof finalDecision === "string") {

            level = finalDecision;

        } else {

            level =
                finalDecision.finalDecision ||
                finalDecision.level ||
                finalDecision.action ||
                "MONITOR";

        }

        // -----------------------------
        // Find matching recommendation
        // -----------------------------

        const recommendation =
            this.library.find(r => r.level === level);

        const actions = recommendation
            ? [...recommendation.actions]
            : [];

        // -----------------------------
        // Context-aware recommendations
        // -----------------------------

        if (
            normalizedEvent.domain === "Terrorism" &&
            !actions.includes("Notify Counter Terrorism Unit")
        ) {

            actions.push(
                "Notify Counter Terrorism Unit"
            );

        }

        if (
            normalizedEvent.fatalities >= 10 &&
            !actions.includes("Activate Crisis Management Team")
        ) {

            actions.push(
                "Activate Crisis Management Team"
            );

        }

        if (
            normalizedEvent.infrastructureImpact === "Severe" &&
            !actions.includes("Assess Critical Infrastructure Damage")
        ) {

            actions.push(
                "Assess Critical Infrastructure Damage"
            );

        }

        // -----------------------------
        // Policy-driven recommendations
        // -----------------------------

        triggeredPolicies.forEach(policy => {

            if (!policy.recommendation)
                return;

            if (
                !actions.includes(policy.recommendation)
            ) {

                actions.push(
                    policy.recommendation
                );

            }

        });

        // -----------------------------
        // Return
        // -----------------------------

        return {

            level,

            totalActions: actions.length,

            actions

        };

    }

}

module.exports = RecommendationEngine;