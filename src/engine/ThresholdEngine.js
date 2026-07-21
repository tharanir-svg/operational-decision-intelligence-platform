class ThresholdEngine {

    constructor(thresholdMatrix) {

        console.log(">>> USING ThresholdEngine from:", __filename);

        this.rules = thresholdMatrix.rules || [];
        this.scoreBands = thresholdMatrix.thresholds || [];

    }

    evaluate(eventContext, riskScore) {

        console.log("\n========== THRESHOLD ENGINE ==========");
        console.log("Incoming Event:", eventContext);
        console.log("Risk Score:", riskScore);

        const eventRule = this._matchEventRule(eventContext);

        if (eventRule) {

            console.log("Matched Event Rule:", eventRule);

            return {

                ruleId: eventRule.ruleId,

                level: eventRule.recommendedAction,

                action: eventRule.recommendedAction,

                severity: eventRule.recommendedSeverity,

                recommendedAction: eventRule.recommendedAction,

                description: "Matched operational rule",

                source: "event-rule"

            };

        }

        console.log("No event rule matched. Evaluating score bands...");

        return this._evaluateByScore(riskScore);

    }

    _matchEventRule(eventContext) {

        return this.rules.find(rule => {

            if (rule.eventType !== eventContext.eventType)
                return false;

            const cond = rule.conditions || {};

            if (
                cond.fatalities?.gte !== undefined &&
                (eventContext.fatalities || 0) < cond.fatalities.gte
            )
                return false;

            if (
                cond.injuries?.gte !== undefined &&
                (eventContext.injuries || 0) < cond.injuries.gte
            )
                return false;

            return true;

        }) || null;

    }

    _evaluateByScore(riskScore) {

        for (const band of this.scoreBands) {

            if (riskScore >= band.minimumScore) {

                console.log("Matched Score Band:", band);

                const result = {

                    minimumScore: band.minimumScore,

                    level: band.level,

                    action: band.level,

                    severity: band.severity,

                    recommendedAction: band.recommendedAction,

                    description: band.description,

                    source: "score-band"

                };

                console.log("Returning Threshold Decision:", result);
                console.log("=====================================\n");

                return result;

            }

        }

        const defaultResult = {

            level: "SIGNAL",

            action: "SIGNAL",

            severity: 1,

            recommendedAction: "Routine Monitoring",

            description: "Default operational threshold",

            source: "default"

        };

        console.log("Returning Default Threshold:", defaultResult);
        console.log("=====================================\n");

        return defaultResult;

    }

}

module.exports = ThresholdEngine;