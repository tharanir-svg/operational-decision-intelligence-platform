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


        // Highest priority rule first
        const sortedRules =
            [...this.rules].sort(
                (a, b) =>
                    Number(b.priority || 0) -
                    Number(a.priority || 0)
            );


        for (
            const rule of
            sortedRules
        ) {

            if (
                !this.matchesRule(
                    rule,
                    triggeredPolicies,
                    normalizedInput
                )
            ) {

                continue;

            }


            triggeredOverrides.push({

                id:
                    rule.id,

                name:
                    rule.name,

                decision:
                    rule.overrideDecision

            });


            finalDecision =
                rule.overrideDecision;


            overrideReason =
                rule.name;


            overridden =
                true;


            // Highest-priority matching
            // override wins.
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


    //==================================================
    // Resolve Decision Level
    //==================================================

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


    //==================================================
    // Match Override Rule
    //==================================================

    matchesRule(
        rule,
        triggeredPolicies,
        input
    ) {

        const conditions =
            rule?.conditions || {};


        //==================================================
        // POLICY
        //==================================================

        if (conditions.policyId) {

            const matched =
                triggeredPolicies.some(
                    policy =>
                        policy?.id ===
                        conditions.policyId
                );


            if (!matched) {

                return false;

            }

        }


        //==================================================
        // DOMAIN
        //==================================================

        if (conditions.domain) {

            if (
                input.domain !==
                conditions.domain
            ) {

                return false;

            }

        }


        //==================================================
        // EVENT TYPE
        //==================================================

        if (conditions.eventType) {

            if (
                input.eventType !==
                conditions.eventType
            ) {

                return false;

            }

        }


        //==================================================
        // INFRASTRUCTURE IMPACT
        //==================================================

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


        //==================================================
        // CRITICAL INFRASTRUCTURE PRESENCE
        //
        // Example rule:
        //
        // "criticalInfrastructure": {
        //     "nonEmpty": true
        // }
        //==================================================

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


                if (
                    !hasInfrastructure
                ) {

                    return false;

                }

            }

        }


        //==================================================
        // FATALITIES
        //==================================================

        if (
            conditions.fatalities
        ) {

            const fatalities =
                Number(
                    input.fatalities ||
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