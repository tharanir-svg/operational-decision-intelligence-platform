class RecommendationEngine {

    constructor(recommendationLibrary) {

        this.library =
            recommendationLibrary.recommendations || [];

    }


    //==================================================
    // Generate Operational Recommendations
    //==================================================

    generate(
        finalDecision,
        normalizedEvent = {},
        triggeredPolicies = []
    ) {

        const level =
            this.resolveLevel(
                finalDecision
            );


        //==============================================
        // Start with threshold workflow
        //==============================================

        const recommendation =
            this.library.find(
                item =>
                    item.level === level
            );


        const actions = [];


        if (
            recommendation &&
            Array.isArray(
                recommendation.actions
            )
        ) {

            recommendation.actions
                .forEach(action => {

                    this.addAction(
                        actions,
                        action
                    );

                });

        }


        //==============================================
        // Determine kinetic status
        //==============================================

        const kinetic =
            this.isKineticEvent(
                normalizedEvent
            );


        //==============================================
        // Kinetic Event Workflow
        //==============================================

        if (kinetic) {

            this.addAction(
                actions,
                {
                    priority:
                        actions.length + 1,

                    owner:
                        "Analyst",

                    action:
                        "Inform the team that this is a kinetic event requiring active follow-up"
                }
            );

        }


        //==============================================
        // National Urgent + Kinetic
        //
        // Look for developments / updates
        // rather than simply issuing the alert.
        //==============================================

        if (
            level === "NATIONAL_URGENT" &&
            kinetic
        ) {

            this.addAction(
                actions,
                {
                    priority:
                        actions.length + 1,

                    owner:
                        "Analyst",

                    action:
                        "Initiate active update search using approved Boolean or AI-assisted sources"
                }
            );

        }


        //==============================================
        // Policy Recommendations
        //==============================================

        triggeredPolicies
            .forEach(policy => {

                if (
                    !policy.recommendation
                ) {

                    return;

                }


                this.addAction(
                    actions,
                    {
                        priority:
                            actions.length + 1,

                        owner:
                            "Analyst",

                        action:
                            policy.recommendation
                    }
                );

            });


        //==============================================
        // Return
        //==============================================

        return {

            level,

            kineticEvent:
                kinetic,

            totalActions:
                actions.length,

            actions

        };

    }


    //==================================================
    // Resolve Decision Level
    //==================================================

    resolveLevel(finalDecision) {

        if (
            typeof finalDecision ===
            "string"
        ) {

            return finalDecision;

        }


        return (
            finalDecision?.finalDecision ||
            finalDecision?.level ||
            finalDecision?.action ||
            "MONITOR"
        );

    }


    //==================================================
    // Detect Kinetic Event
    //==================================================

    isKineticEvent(event = {}) {

        const eventType =
            this.text(
                event.eventType
            );

        const weapons =
            this.toArray(
                event.weapons
            )
                .join(" ");

        const threats =
            this.toArray(
                event.threatIndicators
            )
                .join(" ");


        const combined =
            [
                eventType,
                weapons,
                threats
            ]
                .join(" ")
                .toLowerCase();


        const kineticIndicators = [

            "suicide bombing",
            "bombing",
            "bomb",
            "explosion",
            "explosive",
            "blast",

            "ied",
            "vbied",

            "shooting",
            "mass shooting",
            "gunfire",

            "armed assault",

            "missile",
            "rocket",
            "artillery",
            "shelling",

            "airstrike",
            "air strike",

            "drone strike"

        ];


        return kineticIndicators
            .some(
                indicator =>
                    combined.includes(
                        indicator
                    )
            );

    }


    //==================================================
    // Add Recommendation Without Duplicates
    //==================================================

    addAction(
        actions,
        recommendation
    ) {

        if (!recommendation) {
            return;
        }


        const normalized =
            typeof recommendation ===
            "string"

                ? {
                    priority:
                        actions.length + 1,

                    owner:
                        "Analyst",

                    action:
                        recommendation
                }

                : {
                    priority:
                        recommendation.priority ??
                        actions.length + 1,

                    owner:
                        recommendation.owner ||
                        "Analyst",

                    action:
                        recommendation.action ||
                        recommendation.description ||
                        ""
                };


        if (
            !normalized.action
        ) {

            return;

        }


        const alreadyExists =
            actions.some(
                existing =>
                    existing.action
                        .toLowerCase() ===
                    normalized.action
                        .toLowerCase()
            );


        if (!alreadyExists) {

            actions.push(
                normalized
            );

        }

    }


    //==================================================
    // Utilities
    //==================================================

    text(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value);

    }


    toArray(value) {

        if (
            Array.isArray(value)
        ) {

            return value;

        }


        if (!value) {

            return [];

        }


        return [value];

    }

}


module.exports =
    RecommendationEngine;