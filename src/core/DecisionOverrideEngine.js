class DecisionOverrideEngine {

    constructor(overrideRules = {}) {

        this.priorityOrder =
            overrideRules.priorityOrder || {};

        this.rules =
            Array.isArray(
                overrideRules.rules
            )
                ? overrideRules.rules
                : [];

    }


    evaluate({
        thresholdDecision,
        triggeredPolicies = [],
        normalizedInput = {}
    }) {

        const initialDecision =
            this.getDecisionLevel(
                thresholdDecision
            );

        let finalDecision =
            initialDecision;

        let overridden =
            false;

        let overrideReason =
            null;

        const triggeredOverrides =
            [];


        const sortedRules =
            [...this.rules].sort(
                (a, b) =>
                    Number(b.priority || 0) -
                    Number(a.priority || 0)
            );


        for (const rule of sortedRules) {

            if (
                !this.matchesRule(
                    rule,
                    triggeredPolicies,
                    normalizedInput
                )
            ) {
                continue;
            }


            const candidateDecision =
                this.getDecisionLevel(
                    rule.overrideDecision
                );


            const currentPriority =
                this.getDecisionPriority(
                    finalDecision
                );

            const candidatePriority =
                this.getDecisionPriority(
                    candidateDecision
                );


            const applied =
                candidatePriority >
                currentPriority;


            triggeredOverrides.push({

                id:
                    rule.id,

                name:
                    rule.name,

                decision:
                    candidateDecision,

                applied

            });


            // Override rules may ESCALATE a decision,
            // but must never downgrade or falsely
            // "override" an equal decision.
            if (!applied) {
                continue;
            }


            finalDecision =
                candidateDecision;

            overrideReason =
                rule.name;

            overridden =
                true;

            // Highest-priority valid escalation wins.
            break;

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

        if (!decision) {
            return "MONITOR";
        }

        if (
            typeof decision ===
            "string"
        ) {
            return decision;
        }

        return (
            decision.level ||
            decision.action ||
            "MONITOR"
        );

    }


    getDecisionPriority(decision) {

        const level =
            this.getDecisionLevel(
                decision
            );


        if (
            this.priorityOrder[level] !==
            undefined
        ) {

            return Number(
                this.priorityOrder[level]
            ) || 0;

        }


        // GLOBAL and GLOBAL_URGENT are equivalent
        // operational severity labels.
        if (
            level === "GLOBAL_URGENT" &&
            this.priorityOrder.GLOBAL !==
            undefined
        ) {

            return Number(
                this.priorityOrder.GLOBAL
            ) || 0;

        }


        if (
            level === "GLOBAL" &&
            this.priorityOrder.GLOBAL_URGENT !==
            undefined
        ) {

            return Number(
                this.priorityOrder.GLOBAL_URGENT
            ) || 0;

        }


        const fallbackOrder = {

            MONITOR: 0,
            SIGNAL: 1,
            LOCAL_URGENT: 2,
            NATIONAL_URGENT: 3,
            GLOBAL: 4,
            GLOBAL_URGENT: 4,
            FLASH: 5

        };


        return (
            fallbackOrder[level] ??
            0
        );

    }


    matchesRule(
        rule,
        triggeredPolicies,
        input
    ) {

        const conditions =
            rule?.conditions || {};


        if (conditions.policyId) {

            const matched =
                triggeredPolicies.some(
                    policy =>
                        (
                            policy?.id ||
                            policy?.policyId
                        ) ===
                        conditions.policyId
                );


            if (!matched) {
                return false;
            }

        }


        if (conditions.domain) {

            if (
                input.domain !==
                conditions.domain
            ) {
                return false;
            }

        }


        if (conditions.eventType) {

            if (
                input.eventType !==
                conditions.eventType
            ) {
                return false;
            }

        }


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


        if (
            conditions
                .criticalInfrastructure
        ) {

            const requirement =
                conditions
                    .criticalInfrastructure;


            if (
                requirement.nonEmpty ===
                true
            ) {

                const infrastructure =
                    input
                        .criticalInfrastructure;


                const hasInfrastructure =

                    Array.isArray(
                        infrastructure
                    )

                        ? infrastructure
                            .some(
                                item =>
                                    String(
                                        item || ""
                                    )
                                        .trim()
                                        .length > 0
                            )

                        : String(
                            infrastructure ||
                            ""
                        )
                            .trim()
                            .length > 0;


                if (!hasInfrastructure) {
                    return false;
                }

            }

        }


        if (
            conditions.fatalities
        ) {

            const fatalities =
                Number(
                    input.fatalities ||
                    input.casualties
                        ?.fatalities ||
                    0
                );


            if (
                conditions
                    .fatalities
                    .gte !==
                    undefined &&

                fatalities <
                    Number(
                        conditions
                            .fatalities
                            .gte
                    )
            ) {

                return false;

            }

        }


        return true;

    }

}


module.exports =
    DecisionOverrideEngine;