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

    // Transport
    "Transportation": "Transportation",
    "Transport": "Transportation",

    // Environment
    "Environmental": "Environmental",

    // Intelligence
    "Intelligence": "Intelligence"

};

        //==========================================
        // Event Type Mapping
        //==========================================

        this.EVENT_MAP = {

            // Terrorism
            "Terrorist Attack": "Suicide Bombing",
            "Bomb Attack": "Bombing",
            "Explosion": "Bombing",
            "Blast": "Bombing",
            "Suicide Attack": "Suicide Bombing",
            "Suicide Bombing": "Suicide Bombing",

            "IED": "Vehicle-Borne IED",
            "VBIED": "Vehicle-Borne IED",

            "Hostage": "Hostage Situation",
            "Kidnapping": "Kidnapping",

            "Facility Attack": "Facility Attack",

            "Assassination": "Assassination",

            "Mass Shooting": "Mass Shooting",

            // Crime
            "Robbery": "Robbery",
            "Murder": "Homicide",

            // Disaster
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
            "Medium": "LOCAL",
            "High": "NATIONAL",
            "Critical": "FLASH",
            "Severe": "FLASH"

        };

    }

    //==================================================
    // Store intelligence
    //==================================================

    set(intelligence) {

        if (!intelligence) {

            this.current = null;

            return;

        }

        const mapped = JSON.parse(
    JSON.stringify(intelligence)
);

        mapped.domain =
            this.mapDomain(mapped.domain);

        mapped.eventType =
            this.mapEvent(mapped.eventType);

        mapped.suggestedThreshold =
            this.mapThreshold(
                mapped.suggestedThreshold
            );

        mapped.summary =
            this.safeString(mapped.summary);

        mapped.country =
            this.safeString(mapped.country);

        mapped.region =
            this.safeString(mapped.region);

        mapped.city =
            this.safeString(mapped.city);

        mapped.reasoning =
            this.safeString(mapped.reasoning);

        mapped.infrastructureImpact =
            this.safeString(
                mapped.infrastructureImpact,
                "None"
            );

        mapped.confidence =
            this.safeNumber(
                mapped.confidence
            );

        mapped.crowdSize =
            this.safeNumber(
                mapped.crowdSize
            );

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

        if (!mapped.casualties) {

            mapped.casualties = {

                fatalities:
                    this.safeNumber(
                        mapped.fatalities
                    ),

                injuries:
                    this.safeNumber(
                        mapped.injuries
                    )

            };

        }

        this.current = mapped;

    }

    //==================================================

    get() {

        return this.current;

    }

    //==================================================
    // Mapping Helpers
    //==================================================

    mapDomain(domain) {

    if (!domain)
        return "";

    const cleaned = String(domain).trim();

    return this.DOMAIN_MAP[cleaned] || cleaned;

}

    mapEvent(eventType) {

        if (!eventType)
            return "";

        return this.EVENT_MAP[eventType] || eventType;

    }

    mapThreshold(level) {

        if (!level)
            return "MONITOR";

        return this.THRESHOLD_MAP[level] || level;

    }

    safeString(value, fallback = "") {

        if (value === null || value === undefined)
            return fallback;

        return String(value);

    }

    safeNumber(value) {

        return Number(value) || 0;

    }

    safeArray(value) {

        return Array.isArray(value)
            ? value
            : [];

    }
    //==================================================
    // Populate Intelligence Page (Page 2)
    //==================================================

    populatePane2() {

        const i = this.current;

        if (!i)
            return;

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
        // Infrastructure
        //------------------------------------------

        setSelectValue(
            "ip-infra",
            i.infrastructureImpact
        );

        //------------------------------------------
        // Threat Indicators
        //------------------------------------------

        $("ip-threats").value =
            i.threatIndicators.join(", ");

        //------------------------------------------
        // Weapons
        //------------------------------------------

        $("ip-weapons").value =
            i.weapons.join(", ");

        //------------------------------------------
        // Critical Infrastructure
        //------------------------------------------

        $("ip-crit-infra").value =
            i.criticalInfrastructure.join(", ");

        //------------------------------------------
        // VIPs
        //------------------------------------------

        $("ip-vips").value =
            i.persons.join(", ");

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
        // UI Refresh
        //------------------------------------------

        updateThresholdColor(
            $("ip-threshold")
        );

    }

    //==================================================
    // Populate Decision Page (Page 3)
    //==================================================

    populatePane3() {

        const i = this.current;

        if (!i)
            return;

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
        // Infrastructure
        //------------------------------------------

        document
            .querySelectorAll(
                'input[name="infrastructure"]'
            )
            .forEach(r => {

                r.checked =
                    r.value ===
                    i.infrastructureImpact;

            });

        //------------------------------------------
        // Badge
        //------------------------------------------

        const badge =
            $("stepOriginBadge");

        if (badge) {

            badge.textContent =
                "Pre-filled from AI Extraction";

            badge.className =
                "step-origin-badge from-intel";

        }

    }

    //==================================================
    // Refresh Both Pages
    //==================================================

    refresh() {

        this.populatePane2();

        this.populatePane3();

    }
    //==================================================
    // Clear Current Intelligence
    //==================================================

    clear() {

        this.current = null;

    }

    //==================================================
    // Has Data
    //==================================================

    hasData() {

        return this.current !== null;

    }

    //==================================================
    // Get Original Intelligence
    //==================================================

    getRaw() {

        return this.current;

    }

    //==================================================
    // Debug
    //==================================================

    debug() {

        console.group("========== Intelligence Mapper ==========");

        console.log("Current Intelligence");

        console.dir(this.current);

        console.groupEnd();

    }

    //==================================================
    // Export for Decision Engine
    //==================================================

    toDecisionInput() {

        if (!this.current)
            return null;

        return {

            domain:
                this.current.domain,

            eventType:
                this.current.eventType,

            region:
                this.current.region,

            country:
                this.current.country,

            city:
                this.current.city,

            fatalities:
                this.current.casualties?.fatalities || 0,

            injuries:
                this.current.casualties?.injuries || 0,

            crowdSize:
                this.current.crowdSize || 0,

            infrastructureImpact:
                this.current.infrastructureImpact,

            confidence:
                this.current.confidence,

            summary:
                this.current.summary,

            reasoning:
                this.current.reasoning,

            threatIndicators:
                [...this.current.threatIndicators],

            weapons:
                [...this.current.weapons],

            organizations:
                [...this.current.organizations],

            persons:
                [...this.current.persons],

            criticalInfrastructure:
                [...this.current.criticalInfrastructure],

            recommendedActions:
                [...this.current.recommendedActions],

            suggestedThreshold:
                this.current.suggestedThreshold,

            suggestedCategory:
                this.current.suggestedCategory

        };

    }

    //==================================================
    // Sync Everything
    //==================================================

    sync() {

        if (!this.current)
            return;

        this.populatePane2();

        this.populatePane3();

    }

}

//======================================================
// Singleton
//======================================================

window.IntelligenceMapperV2 =
    new IntelligenceMapperV2();