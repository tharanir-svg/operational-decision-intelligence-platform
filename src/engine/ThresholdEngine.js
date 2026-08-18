class ThresholdEngine {

    constructor(thresholdMatrix) {

        console.log(
            ">>> USING ThresholdEngine from:",
            __filename
        );

        this.rules =
            thresholdMatrix.rules || [];

        this.scoreBands =
            thresholdMatrix.thresholds || [];

    }


    //==================================================
    // Evaluate
    //==================================================

    evaluate(
        eventContext,
        riskScore
    ) {

        console.log(
            "\n========== THRESHOLD ENGINE =========="
        );

        console.log(
            "Incoming Event:",
            eventContext
        );

        console.log(
            "Risk Score:",
            riskScore
        );


        //==============================================
        // Evaluate operational rules
        //==============================================

        const ruleDecision =
            this._evaluateRules(
                eventContext
            );


        //==============================================
        // Evaluate score bands
        //==============================================

        const scoreDecision =
            this._evaluateByScore(
                riskScore
            );


        console.log(
            "Rule Decision:",
            ruleDecision
        );

        console.log(
            "Score Decision:",
            scoreDecision
        );


        //==============================================
        // Select the HIGHER operational threshold
        //
        // Important:
        // Event rules establish minimum thresholds.
        // They must never downgrade a higher score-band
        // decision.
        //==============================================

        const finalDecision =
            this._selectHigherDecision(
                ruleDecision,
                scoreDecision
            );


        console.log(
            "Returning Threshold Decision:",
            finalDecision
        );

        console.log(
            "=====================================\n"
        );


        return finalDecision;

    }


    //==================================================
    // Evaluate Event Rules
    //==================================================

    _evaluateRules(eventContext) {

        const matchedRules =
            this.rules.filter(
                rule =>
                    this._matchesRule(
                        rule,
                        eventContext
                    )
            );


        if (!matchedRules.length) {

            return null;

        }


        //------------------------------------------
        // Multiple rules may match.
        // Select the highest-severity rule.
        //------------------------------------------

        const strongestRule =
            matchedRules.reduce(
                (
                    strongest,
                    current
                ) => {

                    if (!strongest) {
                        return current;
                    }


                    return (
                        Number(
                            current.recommendedSeverity
                        ) >
                        Number(
                            strongest.recommendedSeverity
                        )
                    )
                        ? current
                        : strongest;

                },
                null
            );


        return {

            ruleId:
                strongestRule.ruleId,

            level:
                strongestRule.recommendedAction,

            action:
                strongestRule.recommendedAction,

            severity:
                Number(
                    strongestRule.recommendedSeverity
                ) || 1,

            recommendedAction:
                strongestRule.recommendedAction,

            description:
                strongestRule.description ||
                "Matched operational threshold rule.",

            source:
                "event-rule",

            matchedRules:
                matchedRules.map(
                    rule => ({
                        ruleId:
                            rule.ruleId,

                        action:
                            rule.recommendedAction,

                        severity:
                            rule.recommendedSeverity
                    })
                )

        };

    }


    //==================================================
    // Match Single Rule
    //==================================================

    _matchesRule(
        rule,
        eventContext
    ) {

        if (!rule) {

            return false;

        }


        //==============================================
        // Event Type
        //
        // "*" means rule applies to every event type.
        //==============================================

        if (
            rule.eventType &&
            rule.eventType !== "*" &&
            rule.eventType !==
                eventContext.eventType
        ) {

            return false;

        }

        //==============================================
// Domain
//==============================================

if (
    rule.domain &&
    rule.domain !==
        eventContext.domain
) {

    return false;

}

        //==============================================
        // Modifier
        //==============================================

        if (
            rule.modifier &&
            !this._matchesModifier(
                rule.modifier,
                eventContext
            )
        ) {

            return false;

        }


        //==============================================
        // Conditions
        //==============================================

        const conditions =
            rule.conditions || {};


        //------------------------------------------
        // Fatalities
        //------------------------------------------

        if (
            conditions.fatalities?.gte !==
            undefined
        ) {

            const fatalities =
                Number(
                    eventContext.fatalities ??
                    eventContext.casualties
                        ?.fatalities ??
                    0
                );


            if (
                fatalities <
                Number(
                    conditions.fatalities.gte
                )
            ) {

                return false;

            }

        }


        //------------------------------------------
        // Injuries
        //------------------------------------------

        if (
            conditions.injuries?.gte !==
            undefined
        ) {

            const injuries =
                Number(
                    eventContext.injuries ??
                    eventContext.casualties
                        ?.injuries ??
                    0
                );


            if (
                injuries <
                Number(
                    conditions.injuries.gte
                )
            ) {

                return false;

            }

        }


        return true;

    }


    //==================================================
    // Modifier Matching
    //==================================================

    _matchesModifier(
        modifier,
        eventContext
    ) {

        if (
            modifier ===
            "Critical Infrastructure"
        ) {

            const infrastructure =
                eventContext
                    .criticalInfrastructure;


            if (
                Array.isArray(
                    infrastructure
                ) &&
                infrastructure.length > 0
            ) {

                return true;

            }


            if (
                typeof infrastructure ===
                    "string" &&
                infrastructure.trim()
            ) {

                return true;

            }


            return (
                eventContext
                    .infrastructureImpact &&
                eventContext
                    .infrastructureImpact !==
                    "None"
            );

        }


        return false;

    }


    //==================================================
    // Score Band Evaluation
    //==================================================

    _evaluateByScore(riskScore) {

        const score =
            Number(
                riskScore
            ) || 0;


        for (
            const band of
            this.scoreBands
        ) {

            if (
                score >=
                Number(
                    band.minimumScore
                )
            ) {

                return {

                    minimumScore:
                        band.minimumScore,

                    level:
                        band.level,

                    action:
                        band.level,

                    severity:
                        Number(
                            band.severity
                        ) || 1,

                    recommendedAction:
                        band.recommendedAction,

                    description:
                        band.description,

                    source:
                        "score-band"

                };

            }

        }


        return {

            minimumScore:
                0,

            level:
                "SIGNAL",

            action:
                "SIGNAL",

            severity:
                1,

            recommendedAction:
                "Send Signal alert from the tool",

            description:
                "Default operational threshold.",

            source:
                "default"

        };

    }


    //==================================================
    // Select Higher Decision
    //==================================================

    _selectHigherDecision(
        ruleDecision,
        scoreDecision
    ) {

        if (!ruleDecision) {

            return scoreDecision;

        }


        if (!scoreDecision) {

            return ruleDecision;

        }


        const ruleSeverity =
            Number(
                ruleDecision.severity
            ) || 0;


        const scoreSeverity =
            Number(
                scoreDecision.severity
            ) || 0;


        //------------------------------------------
        // Rule is stronger
        //------------------------------------------

        if (
            ruleSeverity >
            scoreSeverity
        ) {

            return {

                ...ruleDecision,

                scoreBandDecision:
                    scoreDecision.level

            };

        }


        //------------------------------------------
        // Score is stronger
        //------------------------------------------

        if (
            scoreSeverity >
            ruleSeverity
        ) {

            return {

                ...scoreDecision,

                matchedRule:
                    ruleDecision.ruleId

            };

        }


        //------------------------------------------
        // Same severity
        //
        // Prefer operational rule because it gives
        // the more specific explanation.
        //------------------------------------------

        return {

            ...ruleDecision,

            scoreBandDecision:
                scoreDecision.level

        };

    }

}


module.exports =
    ThresholdEngine;