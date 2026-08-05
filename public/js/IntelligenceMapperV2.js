class IntelligenceMapperV2 {

    constructor() {

        this.current = null;

    }

    set(intelligence) {

        this.current = intelligence;

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