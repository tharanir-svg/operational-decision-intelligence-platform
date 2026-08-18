class DecisionOverrideEngine {

    constructor(overrideRules) {

        this.priorityOrder =
            overrideRules.priorityOrder || {};

        this.rules =
            overrideRules.rules || [];

    }

    evaluate({
        thresholdDecision,
        triggeredPolicies = [],
        normalizedInput = {}
    }) {

        const initialDecision =
            this.getDecisionLevel(thresholdDecision);

        let finalDecision = initialDecision;

        let overridden = false;

        let overrideReason = null;

        const triggeredOverrides = [];

        // Highest priority rule first
        const sortedRules =
            [...this.rules].sort(
                (a, b) => b.priority - a.priority
            );

        for (const rule of sortedRules) {

            if (
                this.matchesRule(
                    rule,
                    triggeredPolicies,
                    normalizedInput
                )
            ) {

                triggeredOverrides.push({
                    id: rule.id,
                    name: rule.name,
                    decision: rule.overrideDecision
                });

                finalDecision =
                    rule.overrideDecision;

                overrideReason =
                    rule.name;

                overridden = true;

                // Highest priority wins
                break;

            }

        }

        return {

            initialDecision,

            finalDecision,

            overridden,

            overrideReason,

            triggeredOverrides

        };

    }

    getDecisionLevel(decision) {

        if (!decision)
            return "MONITOR";

        if (typeof decision === "string")
            return decision;

        return (
            decision.level ||
            decision.action ||
            "MONITOR"
        );

    }

    matchesRule(
        rule,
        triggeredPolicies,
        input
    ) {

        const conditions =
            rule.conditions || {};

        // -------------------------
        // Policy Match
        // -------------------------

        if (conditions.policyId) {

            const matched =
                triggeredPolicies.some(
                    policy =>
                        policy.id ===
                        conditions.policyId
                );

            if (!matched)
                return false;

        }

        // -------------------------
        // Domain
        // -------------------------

        if (conditions.domain) {

            if (
                input.domain !==
                conditions.domain
            ) {

                return false;

            }

        }

        // -------------------------
        // Event Type
        // -------------------------

        if (conditions.eventType) {

            if (
                input.eventType !==
                conditions.eventType
            ) {

                return false;

            }

        }

        // -------------------------
        // Infrastructure
        // -------------------------

        if (
            conditions.infrastructureImpact
        ) {

            if (
                input.infrastructureImpact !==
                conditions.infrastructureImpact
            ) {

                return false;

            }

        }

        // -------------------------
        // Fatalities
        // -------------------------

        if (conditions.fatalities) {

            const fatalities =
                Number(
                    input.fatalities || 0
                );

            if (
                conditions.fatalities.gte !==
                undefined &&
                fatalities <
                    conditions.fatalities.gte
            ) {

                return false;

            }

        }

        return true;

    }

}

module.exports =
    DecisionOverrideEngine;