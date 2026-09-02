class PolicyEngine {

    constructor(policyLibrary) {

        this.policyLibrary =
            policyLibrary || {
                policies: []
            };

    }


    evaluate(eventContext) {

        const triggeredPolicies = [];


        for (
            const policy of
            this.policyLibrary.policies
        ) {

            const evaluation =
                this.evaluatePolicy(
                    policy,
                    eventContext
                );


            if (
                evaluation.matched
            ) {

                triggeredPolicies.push(
                    evaluation
                );

            }

        }


        //==================================================
        // BASELINE SUPPRESSION
        //
        // POL-001 is the fallback monitoring policy.
        //
        // If a substantive policy is triggered,
        // Signal Baseline should not be presented as
        // the event's triggered operational policy.
        //==================================================

        const substantivePolicies =
            triggeredPolicies.filter(
                policy =>
                    policy.id !==
                    "POL-001"
            );


        const finalPolicies =
            substantivePolicies.length > 0

                ? substantivePolicies

                : triggeredPolicies;


        finalPolicies.sort(

            (a, b) => {

                const severityDifference =
                    Number(
                        b.severity || 0
                    ) -
                    Number(
                        a.severity || 0
                    );


                if (
                    severityDifference !== 0
                ) {

                    return severityDifference;

                }


                return (
                    Number(
                        b.priority || 0
                    ) -
                    Number(
                        a.priority || 0
                    )
                );

            }

        );


        return finalPolicies;

    }


    evaluatePolicy(
        policy,
        eventContext
    ) {

        const reasons = [];


        //==================================================
        // DOMAIN
        //==================================================

        if (
            policy.appliesTo &&
            !policy.appliesTo.includes(
                "All"
            )
        ) {

            if (
                !policy.appliesTo.includes(
                    eventContext.domain
                )
            ) {

                return {
                    matched: false
                };

            }


            reasons.push(
                `Domain: ${eventContext.domain}`
            );

        }


        //==================================================
        // EVENT TYPE
        //==================================================

        if (
            policy.eventTypes
        ) {

            if (
                !policy.eventTypes.includes(
                    eventContext.eventType
                )
            ) {

                return {
                    matched: false
                };

            }


            reasons.push(
                `Event Type: ${eventContext.eventType}`
            );

        }


        //==================================================
        // CONDITIONS
        //==================================================

        const conditions =
            policy.conditions || {};


        const conditionLogic =
            String(
                policy.conditionLogic ||
                "ALL"
            )
                .trim()
                .toUpperCase();


        //==================================================
        // CASUALTY CONDITIONS
        //
        // Default = ALL
        //
        // POL-003 Mass Casualty uses:
        //
        // conditionLogic: "ANY"
        //
        // fatalities >= 3 OR injuries >= 5
        //==================================================

        const casualtyChecks = [];


        if (
            conditions
                .fatalities
                ?.gte !==
            undefined
        ) {

            const threshold =
                Number(
                    conditions
                        .fatalities
                        .gte
                );


            const actual =
                Number(
                    eventContext
                        .fatalities ||
                    0
                );


            casualtyChecks.push({

                field:
                    "Fatalities",

                matched:
                    actual >= threshold,

                reason:
                    `Fatalities >= ${threshold}`

            });

        }


        if (
            conditions
                .injuries
                ?.gte !==
            undefined
        ) {

            const threshold =
                Number(
                    conditions
                        .injuries
                        .gte
                );


            const actual =
                Number(
                    eventContext
                        .injuries ||
                    0
                );


            casualtyChecks.push({

                field:
                    "Injuries",

                matched:
                    actual >= threshold,

                reason:
                    `Injuries >= ${threshold}`

            });

        }


        if (
            casualtyChecks.length > 0
        ) {

            const casualtyMatched =

                conditionLogic === "ANY"

                    ? casualtyChecks.some(
                        check =>
                            check.matched
                    )

                    : casualtyChecks.every(
                        check =>
                            check.matched
                    );


            if (
                !casualtyMatched
            ) {

                return {
                    matched: false
                };

            }


            // For ANY logic, show only conditions
            // that actually triggered the policy.
            //
            // For ALL logic, every condition has
            // already matched.

            casualtyChecks
                .filter(
                    check =>
                        check.matched
                )
                .forEach(
                    check => {

                        reasons.push(
                            check.reason
                        );

                    }
                );

        }


        //==================================================
        // CONFIDENCE
        //==================================================

        if (
            conditions
                .confidence
                ?.gte !==
            undefined
        ) {

            const confidence =
                Number(
                    eventContext
                        .confidenceAssessment
                        ?.score ||
                    eventContext
                        .confidence ||
                    0
                );


            if (
                confidence <
                Number(
                    conditions
                        .confidence
                        .gte
                )
            ) {

                return {
                    matched: false
                };

            }


            reasons.push(

                `Confidence >= ${conditions.confidence.gte}`

            );

        }


        //==================================================
        // REGION
        //==================================================

        if (
            policy.regions
        ) {

            if (
                !policy.regions.includes(
                    eventContext.region
                )
            ) {

                return {
                    matched: false
                };

            }


            reasons.push(
                `Region: ${eventContext.region}`
            );

        }


        //==================================================
        // COUNTRY
        //==================================================

        if (
            policy.countries
        ) {

            if (
                !policy.countries.includes(
                    eventContext.country
                )
            ) {

                return {
                    matched: false
                };

            }


            reasons.push(
                `Country: ${eventContext.country}`
            );

        }


        //==================================================
        // INFRASTRUCTURE
        //==================================================

        if (
            policy.infrastructure
        ) {

            if (
                !policy.infrastructure.includes(
                    eventContext.infrastructure
                )
            ) {

                return {
                    matched: false
                };

            }


            reasons.push(
                `Infrastructure: ${eventContext.infrastructure}`
            );

        }


        //==================================================
        // MATCHED POLICY
        //==================================================

        return {

            matched:
                true,

            id:
                policy.id ||
                policy.policyId ||
                "",

            policyId:
                policy.id ||
                policy.policyId ||
                "",

            name:
                policy.name ||
                policy.title ||
                "",

            title:
                policy.name ||
                policy.title ||
                "",

            severity:
                policy.severity,

            priority:
                policy.priority ||
                0,

            decisionAction:
                policy.decisionAction ||
                null,

            reasons

        };

    }

}


module.exports =
    PolicyEngine;