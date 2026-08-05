class ValidatorV2 {

    validate(intel) {

        if (!intel)
            throw new Error("No intelligence supplied.");

        //---------------------------------------
        // Required fields
        //---------------------------------------

        intel.summary = this.str(intel.summary);

        intel.eventType = this.str(intel.eventType);

        intel.domain = this.str(intel.domain);

        intel.region = this.str(intel.region);

        intel.country = this.str(intel.country);

        intel.city = this.str(intel.city);

        //---------------------------------------
        // Casualties
        //---------------------------------------

        intel.casualties ??= {};

        intel.casualties.fatalities =
            this.num(intel.casualties.fatalities);

        intel.casualties.injuries =
            this.num(intel.casualties.injuries);

        //---------------------------------------
        // Confidence
        //---------------------------------------

        intel.confidence =
            this.calculateConfidence(intel);

        //---------------------------------------
        // Infrastructure
        //---------------------------------------

        intel.infrastructureImpact =
            this.normalizeInfrastructure(
                intel.infrastructureImpact
            );

        //---------------------------------------
        // Arrays
        //---------------------------------------

        intel.threatIndicators =
            this.array(intel.threatIndicators);

        intel.weapons =
            this.array(intel.weapons);

        intel.criticalInfrastructure =
            this.array(intel.criticalInfrastructure);

        intel.organizations =
            this.array(intel.organizations);

        intel.persons =
            this.array(intel.persons);

        intel.recommendedActions =
            this.array(intel.recommendedActions);

        //---------------------------------------
        // Suggested Threshold
        //---------------------------------------

        if (!intel.suggestedThreshold) {

            intel.suggestedThreshold =
                this.calculateThreshold(intel);

        }

        //---------------------------------------
        // Suggested Category
        //---------------------------------------

        if (!intel.suggestedCategory) {

            intel.suggestedCategory =
                this.calculateCategory(intel);

        }

        //---------------------------------------
        // AI Reasoning
        //---------------------------------------

        if (!intel.reasoning) {

            intel.reasoning =
                this.generateReasoning(intel);

        }

        //---------------------------------------
        // Timestamp
        //---------------------------------------

        intel.timestamp =
            new Date().toISOString();

        return intel;

    }

    //--------------------------------------------

    calculateConfidence(i) {

        let score = 20;

        if (i.summary) score += 10;
        if (i.eventType) score += 15;
        if (i.domain) score += 15;
        if (i.region) score += 10;
        if (i.country) score += 10;

        if (i.casualties.fatalities > 0)
            score += 10;

        if (i.casualties.injuries > 0)
            score += 10;

        if (i.weapons.length)
            score += 5;

        if (i.organizations.length)
            score += 5;

        if (i.persons.length)
            score += 5;

        return Math.min(score,100);

    }

    //--------------------------------------------

    calculateThreshold(i) {

        if (i.casualties.fatalities >= 20)
            return "FLASH";

        if (i.casualties.fatalities >= 5)
            return "GLOBAL";

        if (i.casualties.injuries >= 20)
            return "GLOBAL";

        if (i.infrastructureImpact === "Severe")
            return "GLOBAL";

        if (i.infrastructureImpact === "Moderate")
            return "NATIONAL";

        return "MONITOR";

    }

    //--------------------------------------------

    calculateCategory(i) {

        if (i.domain === "Terrorism")
            return "Security";

        if (i.domain === "Cyber")
            return "Technology";

        if (i.domain === "Politics")
            return "Political";

        if (i.domain === "Weather")
            return "Natural Hazard";

        return "General";

    }

    //--------------------------------------------

    generateReasoning(i) {

        return `AI identified a ${i.eventType} incident in ${i.country}. Estimated threshold is ${i.suggestedThreshold} based on casualties, infrastructure impact and extracted intelligence.`;

    }

    //--------------------------------------------

    normalizeInfrastructure(value){

        const allowed = [
            "None",
            "Minor",
            "Moderate",
            "Severe"
        ];

        if(!allowed.includes(value))
            return "None";

        return value;

    }

    //--------------------------------------------

    str(v){

        if(v===null||v===undefined)
            return "";

        return String(v);

    }

    //--------------------------------------------

    num(v){

        const n=Number(v);

        return Number.isNaN(n)?0:n;

    }

    //--------------------------------------------

    array(v){

        if(!v)
            return [];

        if(Array.isArray(v))
            return v;

        return [v];

    }

}

module.exports = ValidatorV2;