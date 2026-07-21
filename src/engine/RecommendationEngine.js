class RecommendationEngine {

    constructor(recommendationLibrary) {

        this.library =
            recommendationLibrary.recommendations || [];

    }

    generate(thresholdDecision) {

        const level =
            thresholdDecision.level ||
            thresholdDecision.action;

        const recommendation =
            this.library.find(r => r.level === level);

        if (!recommendation) {

            return {

                level,

                actions: []

            };

        }

        return {

            level,

            actions: recommendation.actions

        };

    }

}

module.exports = RecommendationEngine;