class ValidatorV2 {

    validate(intel) {

        if (!intel) {
            throw new Error(
                "No intelligence supplied."
            );
        }


        //==================================================
        // Core Classification
        //==================================================

        intel.summary =
            this.str(
                intel.summary
            );

        intel.eventType =
            this.str(
                intel.eventType
            );

        intel.domain =
            this.str(
                intel.domain
            );

        intel.region =
            this.str(
                intel.region
            );

        intel.country =
            this.str(
                intel.country
            );

        intel.city =
            this.str(
                intel.city
            );


        //==================================================
        // Casualties
        //==================================================

        intel.casualties ??= {};

        intel.casualties.fatalities =
            this.num(
                intel.casualties.fatalities
            );

        intel.casualties.injuries =
            this.num(
                intel.casualties.injuries
            );


        //==================================================
        // Arrays
        // Normalize BEFORE infrastructure/confidence
        //==================================================

        intel.threatIndicators =
            this.array(
                intel.threatIndicators
            );

        intel.weapons =
            this.array(
                intel.weapons
            );

        intel.criticalInfrastructure =
            this.array(
                intel.criticalInfrastructure
            );

        intel.organizations =
            this.array(
                intel.organizations
            );

        intel.persons =
            this.array(
                intel.persons
            );

        intel.recommendedActions =
            this.array(
                intel.recommendedActions
            );


        //==================================================
        // Infrastructure Impact
        //==================================================

        intel.infrastructureImpact =
            this.resolveInfrastructureImpact(
                intel
            );


        //==================================================
        // Confidence
        //==================================================

        intel.confidence =
            this.calculateConfidence(
                intel
            );


        //==================================================
        // Suggested Threshold
        //==================================================

        if (
            !intel.suggestedThreshold
        ) {

            intel.suggestedThreshold =
                this.calculateThreshold(
                    intel
                );

        }


        //==================================================
        // Suggested Category
        //==================================================

        if (
            !intel.suggestedCategory
        ) {

            intel.suggestedCategory =
                this.calculateCategory(
                    intel
                );

        }


        //==================================================
        // Reasoning
        //==================================================

        if (
            !intel.reasoning
        ) {

            intel.reasoning =
                this.generateReasoning(
                    intel
                );

        }


        //==================================================
        // Timestamp
        //==================================================

        intel.timestamp =
            new Date()
                .toISOString();


        return intel;

    }


    //======================================================
    // Infrastructure Impact Resolver
    //======================================================

    resolveInfrastructureImpact(i) {

        const supplied =
            this.normalizeInfrastructure(
                i.infrastructureImpact
            );


        //------------------------------------------
        // Respect explicit meaningful AI assessment
        //------------------------------------------

        if (
            supplied === "Severe" ||
            supplied === "Moderate" ||
            supplied === "Minor"
        ) {

            return supplied;

        }


        //------------------------------------------
        // Generic operational inference
        //
        // IMPORTANT:
        // No White House / airport / hospital /
        // stadium / asset-name hardcoding.
        //------------------------------------------

        const criticalInfrastructure =
            this.array(
                i.criticalInfrastructure
            );


        const hasCriticalInfrastructure =
            criticalInfrastructure.length > 0;


        if (
            !hasCriticalInfrastructure
        ) {

            return "None";

        }


        const fatalities =
            this.num(
                i.casualties?.fatalities
            );

        const injuries =
            this.num(
                i.casualties?.injuries
            );


        const domain =
            this.str(
                i.domain
            )
                .toLowerCase();


        const eventType =
            this.str(
                i.eventType
            )
                .toLowerCase();


        const threatText =
            this.array(
                i.threatIndicators
            )
                .join(" ")
                .toLowerCase();


        const weaponText =
            this.array(
                i.weapons
            )
                .join(" ")
                .toLowerCase();


        //------------------------------------------
        // Determine whether event is kinetic
        //------------------------------------------

        const combinedText =
            [
                eventType,
                threatText,
                weaponText
            ]
                .join(" ");


        const kineticIndicators = [

            "bomb",
            "bombing",
            "explosion",
            "explosive",
            "blast",
            "ied",
            "vbied",
            "shooting",
            "gunfire",
            "armed assault",
            "attack",
            "missile",
            "rocket",
            "drone strike",
            "airstrike"

        ];


        const kineticEvent =
            kineticIndicators.some(
                indicator =>
                    combinedText.includes(
                        indicator
                    )
            );


        const terrorismEvent =
            domain === "terrorism";


        //==================================================
        // SEVERE
        //
        // Critical infrastructure +
        // significant kinetic / terrorism event +
        // major casualties
        //==================================================

        if (
            hasCriticalInfrastructure &&
            (
                terrorismEvent ||
                kineticEvent
            ) &&
            (
                fatalities >= 10 ||
                injuries >= 20
            )
        ) {

            return "Severe";

        }


        //==================================================
        // MODERATE
        //
        // Critical infrastructure involved in
        // a kinetic / terrorism incident
        //==================================================

        if (
            hasCriticalInfrastructure &&
            (
                terrorismEvent ||
                kineticEvent
            )
        ) {

            return "Moderate";

        }


        //==================================================
        // MINOR
        //
        // Critical infrastructure identified but
        // no confirmed kinetic/high-casualty impact
        //==================================================

        if (
            hasCriticalInfrastructure
        ) {

            return "Minor";

        }


        return "None";

    }


    //======================================================
    // Confidence
    //======================================================

    calculateConfidence(i) {

        let score = 20;


        if (i.summary)
            score += 10;

        if (i.eventType)
            score += 15;

        if (i.domain)
            score += 15;

        if (i.region)
            score += 10;

        if (i.country)
            score += 10;


        if (
            i.casualties.fatalities > 0
        ) {

            score += 10;

        }


        if (
            i.casualties.injuries > 0
        ) {

            score += 10;

        }


        if (
            i.weapons.length
        ) {

            score += 5;

        }


        if (
            i.organizations.length
        ) {

            score += 5;

        }


        if (
            i.persons.length
        ) {

            score += 5;

        }


        return Math.min(
            score,
            100
        );

    }


    //======================================================
    // Suggested Threshold
    //======================================================

    calculateThreshold(i) {

        if (
            i.casualties.fatalities >= 20
        ) {

            return "FLASH";

        }


        if (
            i.casualties.fatalities >= 5
        ) {

            return "GLOBAL";

        }


        if (
            i.casualties.injuries >= 20
        ) {

            return "GLOBAL";

        }


        if (
            i.infrastructureImpact ===
            "Severe"
        ) {

            return "GLOBAL";

        }


        if (
            i.infrastructureImpact ===
            "Moderate"
        ) {

            return "NATIONAL";

        }


        return "MONITOR";

    }


    //======================================================
    // Suggested Category
    //======================================================

    calculateCategory(i) {

        if (
            i.domain === "Terrorism"
        ) {

            return "Security";

        }


        if (
            i.domain === "Cyber"
        ) {

            return "Technology";

        }


        if (
            i.domain === "Politics"
        ) {

            return "Political";

        }


        if (
            i.domain === "Weather"
        ) {

            return "Natural Hazard";

        }


        return "General";

    }


    //======================================================
    // Reasoning
    //======================================================

    generateReasoning(i) {

        return (
            `AI identified a ${i.eventType} incident ` +
            `in ${i.country}. ` +
            `Estimated threshold is ${i.suggestedThreshold} ` +
            `based on casualties, infrastructure impact ` +
            `and extracted intelligence.`
        );

    }


    //======================================================
    // Infrastructure Normalization
    //======================================================

    normalizeInfrastructure(value) {

        const allowed = [

            "None",
            "Minor",
            "Moderate",
            "Severe"

        ];


        if (
            !allowed.includes(
                value
            )
        ) {

            return "None";

        }


        return value;

    }


    //======================================================
    // Utilities
    //======================================================

    str(v) {

        if (
            v === null ||
            v === undefined
        ) {

            return "";

        }


        return String(v);

    }


    num(v) {

        const n =
            Number(v);


        return Number.isNaN(n)
            ? 0
            : n;

    }


    array(v) {

        if (!v) {
            return [];
        }


        if (
            Array.isArray(v)
        ) {

            return v;

        }


        return [v];

    }

}


module.exports =
    ValidatorV2;