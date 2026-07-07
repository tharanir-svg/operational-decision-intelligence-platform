class ConfidenceEngine {

    calculate(intelligence) {

        let score = 0;

        if (intelligence.summary)
            score += 15;

        if (intelligence.eventType)
            score += 10;

        if (intelligence.location)
            score += 10;

        if (intelligence.country)
            score += 10;

        if (intelligence.region)
            score += 10;

        if (intelligence.fatalities > 0)
            score += 10;

        if (intelligence.injuries > 0)
            score += 10;

        if (
            Array.isArray(intelligence.entities) &&
            intelligence.entities.length > 0
        )
            score += 10;

        if (
            Array.isArray(intelligence.keywords) &&
            intelligence.keywords.length > 0
        )
            score += 10;

        if (intelligence.explanation)
            score += 5;

        return {
            score,
            level: this.level(score)
        };

    }

    level(score) {

        if (score >= 90)
            return "Very High";

        if (score >= 75)
            return "High";

        if (score >= 60)
            return "Medium";

        return "Low";

    }

}

module.exports = ConfidenceEngine;