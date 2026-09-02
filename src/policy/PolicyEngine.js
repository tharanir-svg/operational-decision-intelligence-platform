class PolicyEngine {

    constructor(policyLibrary) {

        this.policyLibrary =
            policyLibrary || { policies: [] };

    }

    evaluate(eventContext) {

        const triggeredPolicies = [];

        for (const policy of this.policyLibrary.policies) {

            const evaluation =
                this.evaluatePolicy(
                    policy,
                    eventContext
                );

            if (evaluation.matched) {

                triggeredPolicies.push(evaluation);

            }

        }

        triggeredPolicies.sort(

            (a, b) =>
                (b.priority || 0) -
                (a.priority || 0)

        );

        return triggeredPolicies;

    }

    evaluatePolicy(policy, eventContext) {

        const reasons = [];

        //---------------------------------------
        // Domain
        //---------------------------------------

        if (policy.appliesTo &&
            !policy.appliesTo.includes("All")) {

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

        //---------------------------------------
        // Event Type
        //---------------------------------------

        if (policy.eventTypes) {

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

        //---------------------------------------
        // Conditions
        //---------------------------------------

        const conditions =
            policy.conditions || {};

        //---------------------------------------
        // Fatalities
        //---------------------------------------

        if (
            conditions.fatalities?.gte !== undefined
        ) {

            if (
                (eventContext.fatalities || 0)
                <
                conditions.fatalities.gte
            ) {

                return {
                    matched: false
                };

            }

            reasons.push(

                `Fatalities >= ${conditions.fatalities.gte}`

            );

        }

        //---------------------------------------
        // Injuries
        //---------------------------------------

        if (
            conditions.injuries?.gte !== undefined
        ) {

            if (
                (eventContext.injuries || 0)
                <
                conditions.injuries.gte
            ) {

                return {
                    matched: false
                };

            }

            reasons.push(

                `Injuries >= ${conditions.injuries.gte}`

            );

        }

        //---------------------------------------
        // Confidence
        //---------------------------------------

        if (
            conditions.confidence?.gte !== undefined
        ) {

            const confidence =
                eventContext
                    .confidenceAssessment
                    ?.score || 0;

            if (
                confidence
                <
                conditions.confidence.gte
            ) {

                return {
                    matched: false
                };

            }

            reasons.push(

                `Confidence >= ${conditions.confidence.gte}`

            );

        }

        //---------------------------------------
        // Region
        //---------------------------------------

        if (policy.regions) {

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

        //---------------------------------------
        // Country
        //---------------------------------------

        if (policy.countries) {

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

        //---------------------------------------
        // Infrastructure
        //---------------------------------------

        if (policy.infrastructure) {

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

        //---------------------------------------

        return {

    matched: true,

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
        policy.priority || 0,

    decisionAction:
        policy.decisionAction ||
        null,

    reasons

};

    }

}

module.exports = PolicyEngine;