class NormalizerV2 {

    normalize(intelligence) {

        //------------------------------------------------
        // Domain
        //------------------------------------------------

        const domainMap = {

            Security: "Terrorism",

            Crime: "Crime",

            Conflict: "Conflict",

            Disaster: "Natural Disaster",

            Cyber: "Cyber"

        };

        intelligence.domain =
            domainMap[intelligence.domain]
            || intelligence.domain;

        //------------------------------------------------
        // Threshold
        //------------------------------------------------

        const thresholdMap = {

            Low: "MONITOR",

            Medium: "LOCAL",

            High: "NATIONAL",

            Critical: "FLASH"

        };

        intelligence.suggestedThreshold =
            thresholdMap[intelligence.suggestedThreshold]
            || "MONITOR";

        //------------------------------------------------
        // Infrastructure
        //------------------------------------------------

        if (!intelligence.infrastructureImpact) {

            intelligence.infrastructureImpact = "None";

        }

        //------------------------------------------------
        // Crowd Size
        //------------------------------------------------

        if (
            intelligence.crowdSize == null
        ) {

            intelligence.crowdSize = 0;

        }

        //------------------------------------------------
        // Arrays
        //------------------------------------------------

        intelligence.threatIndicators ||= [];

        intelligence.weapons ||= [];

        intelligence.organizations ||= [];

        intelligence.persons ||= [];

        intelligence.criticalInfrastructure ||= [];

        intelligence.recommendedActions ||= [];

        return intelligence;

    }

}

module.exports = NormalizerV2;