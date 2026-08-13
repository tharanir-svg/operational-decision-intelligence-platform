class IntelligenceMapperV2 {

    constructor() {

        this.current = null;

        //==========================================
        // Enterprise Domain Mapping
        //==========================================

        this.DOMAIN_MAP = {

            // Enterprise Security
            "Security": "Terrorism",
            "Physical Security": "Terrorism",
            "Terrorism": "Terrorism",

            // Conflict
            "Conflict": "Armed Conflict",
            "Armed Conflict": "Armed Conflict",

            // Crime
            "Crime": "Crime",
            "Organized Crime": "Organized Crime",

            // Cyber
            "Cyber": "Cyber Security",
            "Cyber Security": "Cyber Security",

            // Public Health
            "Health": "Public Health",
            "Public Health": "Public Health",

            // Infrastructure
            "Infrastructure": "Infrastructure",

            // Political
            "Political": "Political",
            "Politics": "Political",

            // Transport
            "Transportation": "Transportation",
            "Transport": "Transportation",

            // Aviation
            "Aviation": "Aviation",

            // Maritime
            "Maritime": "Maritime",

            // Energy
            "Energy": "Energy",

            // Industrial
            "Industrial": "Industrial",

            // Weather
            "Weather": "Weather",

            // Environment
            "Environmental": "Environmental",

            // Supply Chain
            "Supply Chain": "Supply Chain",

            // Financial
            "Financial": "Financial",

            // Border
            "Border Security": "Border Security",

            // Intelligence
            "Intelligence": "Intelligence"

        };


        //==========================================
        // Event Type Mapping
        //==========================================

        this.EVENT_MAP = {

            // Terrorism
            "Terrorist Attack": "Facility Attack",
            "Bomb Attack": "Bombing",
            "Explosion": "Bombing",
            "Blast": "Bombing",
            "Suicide Attack": "Suicide Bombing",
            "Suicide Bombing": "Suicide Bombing",

            "IED": "Explosive Device Found",
            "VBIED": "Vehicle-Borne IED",

            "Hostage": "Hostage Situation",
            "Kidnapping": "Kidnapping",

            "Facility Attack": "Facility Attack",
            "Assassination": "Assassination",
            "Mass Shooting": "Mass Shooting",

            // Crime
            "Robbery": "Armed Robbery",
            "Murder": "Homicide",

            // Weather / Disaster
            "Earthquake": "Earthquake",
            "Flood": "Flood",
            "Wildfire": "Wildfire",
            "Cyclone": "Cyclone",

            // Default
            "Unknown": ""

        };


        //==========================================
        // Threshold Mapping
        //==========================================

        this.THRESHOLD_MAP = {

            "Low": "MONITOR",
            "Medium": "LOCAL_URGENT",
            "High": "NATIONAL_URGENT",
            "Critical": "FLASH",
            "Severe": "FLASH",

            "Signal": "SIGNAL",
            "SIGNAL": "SIGNAL",

            "Local": "LOCAL_URGENT",
            "LOCAL": "LOCAL_URGENT",
            "LOCAL_URGENT": "LOCAL_URGENT",

            "National": "NATIONAL_URGENT",
            "NATIONAL": "NATIONAL_URGENT",
            "NATIONAL_URGENT": "NATIONAL_URGENT",

            "Global": "GLOBAL_URGENT",
            "GLOBAL": "GLOBAL_URGENT",
            "GLOBAL_URGENT": "GLOBAL_URGENT",

            "FLASH": "FLASH",
            "MONITOR": "MONITOR"

        };

    }


    //==================================================
    // Store Intelligence
    //==================================================

    set(intelligence) {

        if (!intelligence) {

            this.current = null;

            return;

        }


        const mapped =
            JSON.parse(
                JSON.stringify(
                    intelligence
                )
            );


        //==========================================
        // Core Classification
        //==========================================

        mapped.domain =
            this.mapDomain(
                mapped.domain
            );

        mapped.eventType =
            this.mapEvent(
                mapped.eventType
            );

        mapped.suggestedThreshold =
            this.mapThreshold(
                mapped.suggestedThreshold
            );


        //==========================================
        // Text Fields
        //==========================================

        mapped.summary =
            this.safeString(
                mapped.summary
            );

        mapped.country =
            this.safeString(
                mapped.country
            );

        mapped.region =
            this.safeString(
                mapped.region
            );

        mapped.city =
            this.safeString(
                mapped.city
            );

        mapped.reasoning =
            this.safeString(
                mapped.reasoning
            );

        mapped.suggestedCategory =
            this.safeString(
                mapped.suggestedCategory
            );


        //==========================================
        // Infrastructure Impact
        //==========================================

        mapped.infrastructureImpact =
            this.normalizeInfrastructureImpact(
                mapped.infrastructureImpact
            );


        //==========================================
        // Numeric Fields
        //==========================================

        mapped.confidence =
            this.safeNumber(
                mapped.confidence
            );

        mapped.crowdSize =
            this.safeNumber(
                mapped.crowdSize
            );


        //==========================================
        // Arrays
        //==========================================

        mapped.threatIndicators =
            this.safeArray(
                mapped.threatIndicators
            );

        mapped.weapons =
            this.safeArray(
                mapped.weapons
            );

        mapped.organizations =
            this.safeArray(
                mapped.organizations
            );

        mapped.persons =
            this.safeArray(
                mapped.persons
            );

        mapped.criticalInfrastructure =
            this.safeArray(
                mapped.criticalInfrastructure
            );

        mapped.recommendedActions =
            this.safeArray(
                mapped.recommendedActions
            );


        //==========================================
        // Casualties
        //==========================================

        const casualties =
            mapped.casualties || {};


        mapped.casualties = {

            fatalities:
                this.safeNumber(
                    casualties.fatalities ??
                    mapped.fatalities
                ),

            injuries:
                this.safeNumber(
                    casualties.injuries ??
                    mapped.injuries
                )

        };


        //==========================================
        // Keep flat casualty fields synchronized
        //==========================================

        mapped.fatalities =
            mapped.casualties.fatalities;

        mapped.injuries =
            mapped.casualties.injuries;


        //==========================================
        // Store
        //==========================================

        this.current = mapped;

    }


    //==================================================
    // Get Current Intelligence
    //==================================================

    get() {

        return this.current;

    }


    //==================================================
    // Domain Mapping
    //==================================================

    mapDomain(domain) {

        if (!domain) {
            return "";
        }

        const cleaned =
            String(domain)
                .trim();

        return (
            this.DOMAIN_MAP[cleaned] ||
            cleaned
        );

    }


    //==================================================
    // Event Mapping
    //==================================================

    mapEvent(eventType) {

        if (!eventType) {
            return "";
        }

        const cleaned =
            String(eventType)
                .trim();

        return (
            this.EVENT_MAP[cleaned] ||
            cleaned
        );

    }


    //==================================================
    // Threshold Mapping
    //==================================================

    mapThreshold(level) {

        if (!level) {
            return "MONITOR";
        }

        const cleaned =
            String(level)
                .trim();

        return (
            this.THRESHOLD_MAP[cleaned] ||
            cleaned
        );

    }


    //==================================================
    // Infrastructure Impact Normalization
    //==================================================

    normalizeInfrastructureImpact(value) {

        const allowed = [
            "None",
            "Minor",
            "Moderate",
            "Severe"
        ];

        const cleaned =
            this.safeString(
                value,
                "None"
            )
            .trim();


        const matched =
            allowed.find(
                item =>
                    item.toLowerCase() ===
                    cleaned.toLowerCase()
            );


        return (
            matched ||
            "None"
        );

    }


    //==================================================
    // Safe String
    //==================================================

    safeString(
        value,
        fallback = ""
    ) {

        if (
            value === null ||
            value === undefined
        ) {

            return fallback;

        }

        return String(value);

    }


    //==================================================
    // Safe Number
    //==================================================

    safeNumber(value) {

        const number =
            Number(value);

        return Number.isFinite(number)
            ? number
            : 0;

    }


    //==================================================
    // Safe Array
    //==================================================

    safeArray(value) {

        if (Array.isArray(value)) {

            return value
                .map(item =>
                    this.safeString(item)
                        .trim()
                )
                .filter(Boolean);

        }


        if (
            typeof value === "string" &&
            value.trim()
        ) {

            return value
                .split(",")
                .map(item =>
                    item.trim()
                )
                .filter(Boolean);

        }


        return [];

    }


    //==================================================
    // Populate Intelligence Page — Page 2
    //==================================================

    populatePane2() {

        const i =
            this.current;

        if (!i) {
            return;
        }


        //------------------------------------------
        // Summary
        //------------------------------------------

        $("ip-summary").value =
            i.summary;


        //------------------------------------------
        // Classification
        //------------------------------------------

        $("ip-event-type").value =
            i.eventType;


        setSelectValue(
            "ip-domain",
            i.domain
        );


        setSelectValue(
            "ip-region",
            i.region
        );


        $("ip-country").value =
            i.country;


        $("ip-location").value =
            i.city;


        //------------------------------------------
        // Confidence
        //------------------------------------------

        $("ip-confidence").value =
            i.confidence;


        updateConfidenceBar(
            i.confidence
        );


        //------------------------------------------
        // Casualties
        //------------------------------------------

        $("ip-fatalities").value =
            i.casualties.fatalities;


        $("ip-injuries").value =
            i.casualties.injuries;


        $("ip-crowd").value =
            i.crowdSize;


        //------------------------------------------
        // Infrastructure Impact
        //------------------------------------------

        setSelectValue(
            "ip-infra",
            i.infrastructureImpact
        );


        //------------------------------------------
        // Threat Indicators
        //------------------------------------------

        $("ip-threats").value =
            i.threatIndicators
                .join(", ");


        //------------------------------------------
        // Weapons
        //------------------------------------------

        $("ip-weapons").value =
            i.weapons
                .join(", ");


        //------------------------------------------
        // Critical Infrastructure
        //------------------------------------------

        $("ip-crit-infra").value =
            i.criticalInfrastructure
                .join(", ");


        //------------------------------------------
        // VIPs
        //------------------------------------------

        $("ip-vips").value =
            i.persons
                .join(", ");


        //------------------------------------------
        // Recommendation
        //------------------------------------------

        $("ip-category").value =
            i.suggestedCategory || "";


        setSelectValue(
            "ip-threshold",
            i.suggestedThreshold
        );


        //------------------------------------------
        // AI Reasoning
        //------------------------------------------

        $("ip-reasoning").value =
            i.reasoning;


        //------------------------------------------
        // Threshold UI
        //------------------------------------------

        updateThresholdColor(
            $("ip-threshold")
        );

    }

        //==================================================
    // Populate Decision Page — Page 3
    //==================================================

    populatePane3() {

        const i =
            this.current;

        if (!i) {
            return;
        }


        //------------------------------------------
        // Domain
        //------------------------------------------

        setSelectValue(
            "domain",
            i.domain
        );


        //------------------------------------------
        // Event Type
        //------------------------------------------

        buildEventOptions(
            i.domain,
            $("eventType"),
            i.eventType
        );


        //------------------------------------------
        // Region
        //------------------------------------------

        setSelectValue(
            "region",
            i.region
        );


        //------------------------------------------
        // Casualties
        //------------------------------------------

        $("fatalities").value =
            i.casualties.fatalities;

        $("injuries").value =
            i.casualties.injuries;


        //------------------------------------------
        // Infrastructure Impact
        //------------------------------------------

        const infrastructureImpact =
            this.normalizeInfrastructureImpact(
                i.infrastructureImpact
            );


        document
            .querySelectorAll(
                'input[name="infrastructure"]'
            )
            .forEach(radio => {

                radio.checked =
                    radio.value ===
                    infrastructureImpact;

            });


        //------------------------------------------
        // Origin Badge
        //------------------------------------------

        const badge =
            $("stepOriginBadge");

        if (badge) {

            badge.textContent =
                "Pre-filled from Approved Intelligence";

            badge.className =
                "step-origin-badge from-intel";

        }

    }


    //==================================================
    // Refresh Both Pages
    //==================================================

    refresh() {

        if (!this.current) {
            return;
        }

        this.populatePane2();
        this.populatePane3();

    }


    //==================================================
    // Synchronize Both Pages
    //==================================================

    sync() {

        if (!this.current) {
            return;
        }

        this.populatePane2();
        this.populatePane3();

    }


    //==================================================
    // Clear Intelligence
    //==================================================

    clear() {

        this.current = null;

    }


    //==================================================
    // Has Intelligence
    //==================================================

    hasData() {

        return this.current !== null;

    }


    //==================================================
    // Get Raw Intelligence
    //==================================================

    getRaw() {

        return this.current;

    }


    //==================================================
    // Debug Intelligence
    //==================================================

    debug() {

        console.group(
            "========== Intelligence Mapper V2 =========="
        );

        console.log(
            "Current Intelligence"
        );

        console.dir(
            this.current
        );

        console.groupEnd();

    }

    //==================================================
    // Export Approved Intelligence for Decision Engine
    //==================================================

    toDecisionInput() {

        if (!this.current) {
            return null;
        }

        const i =
            this.current;


        return {

            //--------------------------------------
            // Classification
            //--------------------------------------

            domain:
                i.domain || "",

            eventType:
                i.eventType || "",

            region:
                i.region || "",

            country:
                i.country || "",

            city:
                i.city || "",


            //--------------------------------------
            // Casualties
            //--------------------------------------

            fatalities:
                this.safeNumber(
                    i.casualties?.fatalities
                ),

            injuries:
                this.safeNumber(
                    i.casualties?.injuries
                ),


            //--------------------------------------
            // Crowd
            //--------------------------------------

            crowdSize:
                this.safeNumber(
                    i.crowdSize
                ),


            //--------------------------------------
            // Infrastructure
            //--------------------------------------

            infrastructureImpact:
                this.normalizeInfrastructureImpact(
                    i.infrastructureImpact
                ),

            criticalInfrastructure:
                this.safeArray(
                    i.criticalInfrastructure
                ),


            //--------------------------------------
            // Confidence
            //--------------------------------------

            confidence:
                this.safeNumber(
                    i.confidence
                ),


            //--------------------------------------
            // Intelligence Narrative
            //--------------------------------------

            summary:
                this.safeString(
                    i.summary
                ),

            reasoning:
                this.safeString(
                    i.reasoning
                ),


            //--------------------------------------
            // Intelligence Indicators
            //--------------------------------------

            threatIndicators:
                this.safeArray(
                    i.threatIndicators
                ),

            weapons:
                this.safeArray(
                    i.weapons
                ),

            organizations:
                this.safeArray(
                    i.organizations
                ),

            persons:
                this.safeArray(
                    i.persons
                ),


            //--------------------------------------
            // AI Recommendation
            //--------------------------------------

            suggestedThreshold:
                this.mapThreshold(
                    i.suggestedThreshold
                ),

            suggestedCategory:
                this.safeString(
                    i.suggestedCategory
                ),


            //--------------------------------------
            // Existing AI Recommendations
            //--------------------------------------

            recommendedActions:
                this.safeArray(
                    i.recommendedActions
                )

        };

    }

}


//======================================================
// Singleton
//======================================================

window.IntelligenceMapperV2 =
    new IntelligenceMapperV2();