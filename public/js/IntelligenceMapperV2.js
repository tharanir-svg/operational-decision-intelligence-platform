constructor() {

    this.current = null;

    //------------------------------------------------
    // Enterprise Domain Mapping
    //------------------------------------------------

    this.DOMAIN_MAP = {

        "Security": "Terrorism",

        "Crime": "Crime",

        "Cyber": "Cyber",

        "Natural Disaster": "Natural Disaster",

        "Health": "Public Health",

        "Political": "Political",

        "Infrastructure": "Infrastructure"

    };

    //------------------------------------------------
    // Enterprise Event Mapping
    //------------------------------------------------

    this.EVENT_MAP = {

        // Terrorism
        "Terrorist Attack": "Suicide Bombing",
        "Bomb Attack": "Bombing",
        "Explosion": "Bombing",
        "IED": "Vehicle-Borne IED",
        "VBIED": "Vehicle-Borne IED",
        "Hostage": "Hostage Situation",
        "Kidnapping": "Hostage Situation",

        // Civil Disorder
        "Protest": "Demonstration",
        "Riot": "Violent Protest",

        // Disaster
        "Earthquake": "Earthquake",
        "Flood": "Flood",
        "Wildfire": "Wildfire",
        "Cyclone": "Cyclone",

        // Default
        "Unknown": ""

    };

    //------------------------------------------------
    // Threshold Mapping
    //------------------------------------------------

    this.THRESHOLD_MAP = {

        "Low": "MONITOR",

        "Medium": "LOCAL",

        "High": "NATIONAL",

        "Critical": "FLASH"

    };

}

set(intelligence) {

    if (!intelligence) {

        this.current = null;
        return;

    }

    const mapped = {

        ...intelligence

    };

    //----------------------------------------
    // Domain
    //----------------------------------------

    mapped.domain =

        this.DOMAIN_MAP[mapped.domain]

        || mapped.domain

        || "";

    //----------------------------------------
    // Event Type
    //----------------------------------------

    mapped.eventType =

        this.EVENT_MAP[mapped.eventType]

        || mapped.eventType

        || "";

    //----------------------------------------
    // Threshold
    //----------------------------------------

    mapped.suggestedThreshold =

        this.THRESHOLD_MAP[mapped.suggestedThreshold]

        || mapped.suggestedThreshold

        || "MONITOR";

    //----------------------------------------
    // Defaults
    //----------------------------------------

    mapped.casualties ||= {

        fatalities: mapped.fatalities || 0,

        injuries: mapped.injuries || 0

    };

    mapped.infrastructureImpact ||= "None";

    mapped.crowdSize ??= 0;

    mapped.summary ||= "";

    mapped.country ||= "";

    mapped.region ||= "";

    mapped.city ||= "";

    mapped.reasoning ||= "";

    mapped.confidence ??= 0;

    mapped.threatIndicators ||= [];

    mapped.weapons ||= [];

    mapped.criticalInfrastructure ||= [];

    mapped.persons ||= [];

    mapped.organizations ||= [];

    mapped.recommendedActions ||= [];

    this.current = mapped;

}
    get() {

        return this.current;

    }

    //----------------------------------------

    populatePane2() {

        const i = this.current;

        if (!i) return;

        //------------------------------------------------
        // Summary
        //------------------------------------------------

        $("ip-summary").value =
            i.summary || "";

        //------------------------------------------------
        // Classification
        //------------------------------------------------

        $("ip-event-type").value =
            i.eventType || "";

        setSelectValue(
            "ip-domain",
            i.domain || ""
        );

        setSelectValue(
            "ip-region",
            i.region || ""
        );

        $("ip-country").value =
            i.country || "";

        $("ip-location").value =
            i.city || "";

        //------------------------------------------------
        // Casualties
        //------------------------------------------------

        $("ip-fatalities").value =
            i.casualties?.fatalities ?? 0;

        $("ip-injuries").value =
            i.casualties?.injuries ?? 0;

        $("ip-crowd").value =
            i.crowdSize ?? 0;

        //------------------------------------------------
        // Intelligence
        //------------------------------------------------

        $("ip-threats").value =
            (i.threatIndicators || []).join(", ");

        $("ip-weapons").value =
            (i.weapons || []).join(", ");

        $("ip-crit-infra").value =
            (i.criticalInfrastructure || []).join(", ");

        $("ip-vips").value =
            (i.persons || []).join(", ");

        //------------------------------------------------
        // Recommendation
        //------------------------------------------------

        $("ip-reasoning").value =
            i.reasoning || "";

        setSelectValue(
            "ip-threshold",
            i.suggestedThreshold || "MONITOR"
        );

        setSelectValue(
            "ip-infra",
            i.infrastructureImpact || "None"
        );

        //------------------------------------------------
        // Confidence
        //------------------------------------------------

        $("ip-confidence").value =
            i.confidence || 0;

        updateConfidenceBar(
            i.confidence || 0
        );

        updateThresholdColor(
            $("ip-threshold")
        );

    }

    //----------------------------------------

    populatePane3() {

        const i = this.current;

        if (!i) return;

        //------------------------------------------------

        setSelectValue(
            "domain",
            i.domain
        );

        buildEventOptions(
            i.domain,
            $("eventType"),
            i.eventType
        );

        setSelectValue(
            "region",
            i.region
        );

        $("fatalities").value =
            i.casualties?.fatalities ?? 0;

        $("injuries").value =
            i.casualties?.injuries ?? 0;

        //------------------------------------------------

        document
            .querySelectorAll(
                'input[name="infrastructure"]'
            )
            .forEach(r => {

                r.checked =
                    r.value ===
                    i.infrastructureImpact;

            });

        //------------------------------------------------

        const badge =
            $("stepOriginBadge");

        badge.textContent =
            "Pre-filled from AI Extraction V2";

        badge.className =
            "step-origin-badge from-intel";

    }

}

window.IntelligenceMapperV2 =
    new IntelligenceMapperV2();