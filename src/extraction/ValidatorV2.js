const fs = require("fs");
const path = require("path");

const ThresholdEngine = require("../engine/ThresholdEngine");
const thresholdMatrix = require("../../knowledge/policies/threshold-matrix.json");


class ValidatorV2 {

    constructor() {

        this.taxonomyPath =
            path.join(
                process.cwd(),
                "knowledge",
                "taxonomy"
            );


        this.countries =
            this.loadJson(
                "countries.json",
                {}
            );


        this.domains =
            this.loadJson(
                "domains.json",
                { domains: [] }
            );


        this.eventTypes =
            this.loadJson(
                "event-types.json",
                {}
            );


        this.validDomains =
            new Set(
                this.domains.domains || []
            );


        this.countryRegionMap =
            this.buildCountryRegionMap();


        this.eventDomainMap =
            this.buildEventDomainMap();


        this.thresholdEngine =
            new ThresholdEngine(
                thresholdMatrix
            );

    }


    //==================================================
    // VALIDATE / ENRICH
    //==================================================

    validate(intel) {

        if (!intel) {

            throw new Error(
                "No intelligence supplied."
            );

        }


        //==================================================
        // CORE TEXT
        //==================================================

        intel.summary =
            this.str(
                intel.summary
            );


        intel.originalText =
            this.str(
                intel.originalText
            );


        intel.eventType =
            this.str(
                intel.eventType
            ).trim();


        intel.domain =
            this.str(
                intel.domain
            ).trim();


        intel.region =
            this.str(
                intel.region
            ).trim();


        intel.country =
            this.str(
                intel.country
            ).trim();


        intel.city =
            this.str(
                intel.city
            ).trim();


        intel.suggestedCategory =
            this.str(
                intel.suggestedCategory
            ).trim();


        intel.reasoning =
            this.str(
                intel.reasoning
            );


        //==================================================
        // CASUALTIES
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
        // ARRAYS
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
        // DETERMINISTIC DOMAIN
        //==================================================

        intel.domain =
            this.resolveDomain(
                intel
            );


        //==================================================
        // DETERMINISTIC REGION
        //==================================================

        intel.region =
            this.resolveRegion(
                intel
            );


        //==================================================
        // INFRASTRUCTURE IMPACT
        //==================================================

        intel.infrastructureImpact =
            this.resolveInfrastructureImpact(
                intel
            );


        //==================================================
        // CONFIDENCE
        //==================================================

        intel.confidence =
            this.calculateConfidence(
                intel
            );


        //==================================================
        // AUTHORITATIVE SUGGESTED THRESHOLD
        //
        // ODIP policy is authoritative.
        // AI suggested threshold is not authoritative.
        //==================================================

        intel.suggestedThreshold =
            this.resolveSuggestedThreshold(
                intel
            );


        //==================================================
        // CATEGORY
        //
        // Keep category aligned to the resolved domain.
        //==================================================

        intel.suggestedCategory =
            this.calculateCategory(
                intel
            );


        //==================================================
        // REASONING
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
        // TIMESTAMP
        //==================================================

        intel.timestamp =
            new Date()
                .toISOString();


        return intel;

    }


    //==================================================
    // DOMAIN RESOLUTION
    //==================================================

    resolveDomain(i) {

        const supplied =
            this.normalizeDomainAlias(
                i.domain
            );


        const possibleDomains =
            this.eventDomainMap[
                i.eventType
            ] || [];


        //==================================================
        // CASE 1
        //
        // Event exists in exactly one taxonomy domain.
        // Taxonomy is authoritative.
        //==================================================

        if (
            possibleDomains.length === 1
        ) {

            return possibleDomains[0];

        }


        //==================================================
        // CASE 2
        //
        // Event exists in multiple taxonomy domains.
        //
        // Example:
        // Mass Shooting may exist under Crime and Terrorism.
        //==================================================

        if (
            possibleDomains.length > 1
        ) {


            //==============================================
            // TERRORISM REQUIRES EVIDENCE
            //==============================================

            if (
                possibleDomains.includes(
                    "Terrorism"
                )
            ) {


                // Evidence supports terrorism.
                if (
                    this.hasTerrorismIndicators(
                        i
                    )
                ) {

                    return "Terrorism";

                }


                // Preserve a supplied non-terrorism domain
                // if it is valid for this event type.
                if (
                    supplied &&
                    supplied !== "Terrorism" &&
                    possibleDomains.includes(
                        supplied
                    )
                ) {

                    return supplied;

                }


                // For Crime/Terrorism ambiguity,
                // default to Crime when no terrorism
                // evidence exists.
                if (
                    possibleDomains.includes(
                        "Crime"
                    )
                ) {

                    return "Crime";

                }


                // Otherwise select another valid
                // non-terrorism taxonomy domain.
                const nonTerrorismDomain =
                    possibleDomains.find(
                        domain =>
                            domain !== "Terrorism"
                    );


                if (
                    nonTerrorismDomain
                ) {

                    return nonTerrorismDomain;

                }

            }


            //==============================================
            // OTHER AMBIGUOUS EVENTS
            //==============================================

            if (
                supplied &&
                possibleDomains.includes(
                    supplied
                )
            ) {

                return supplied;

            }


            return possibleDomains[0];

        }


        //==================================================
        // CASE 3
        //
        // Event not resolved by taxonomy.
        // Keep a valid supplied domain.
        //==================================================

        if (
            supplied &&
            this.validDomains.has(
                supplied
            )
        ) {

            return supplied;

        }


        //==================================================
        // CASE 4
        //
        // Suggested-category fallback.
        //==================================================

        const category =
            this.str(
                i.suggestedCategory
            )
                .trim()
                .toLowerCase();


        const categoryMap = {

            "violent crime":
                "Crime",

            "crime":
                "Crime",

            "security":
                "Terrorism",

            "national security threat":
                "Terrorism",

            "terrorism":
                "Terrorism",

            "cyber":
                "Cyber Security",

            "technology":
                "Cyber Security",

            "political":
                "Political",

            "natural hazard":
                "Weather",

            "weather":
                "Weather",

            "public health":
                "Public Health"

        };


        return (
            categoryMap[
                category
            ] ||
            supplied ||
            ""
        );

    }


    //==================================================
    // DOMAIN ALIASES
    //==================================================

    normalizeDomainAlias(value) {

        const cleaned =
            this.str(
                value
            ).trim();


        const aliases = {

            "Security":
                "Terrorism",

            "Physical Security":
                "Terrorism",

            "Cyber":
                "Cyber Security",

            "Politics":
                "Political",

            "Health":
                "Public Health",

            "Conflict":
                "Armed Conflict"

        };


        return (
            aliases[
                cleaned
            ] ||
            cleaned
        );

    }


    //==================================================
    // TERRORISM EVIDENCE
    //==================================================

    hasTerrorismIndicators(i) {

        /*
         * IMPORTANT
         *
         * Do NOT use:
         *
         * i.domain
         * i.suggestedCategory
         *
         * Those are AI classifications.
         *
         * They must not be allowed to prove their
         * own classification.
         */


        const text = [

            i.summary,

            i.originalText,

            ...this.array(
                i.threatIndicators
            ),

            ...this.array(
                i.organizations
            )

        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


        const indicators = [

            "terrorist",

            "terrorism",

            "terror group",

            "terror organization",

            "extremist",

            "extremism",

            "ideologically motivated",

            "jihadist",

            "jihad",

            "militant group",

            "claimed responsibility",

            "terror cell"

        ];


        return indicators.some(
            indicator =>
                text.includes(
                    indicator
                )
        );

    }


    //==================================================
    // REGION RESOLUTION
    //==================================================

    resolveRegion(i) {

        const country =
            this.str(
                i.country
            ).trim();


        // Country taxonomy is authoritative.
        if (
            country &&
            this.countryRegionMap[
                country
            ]
        ) {

            return this.countryRegionMap[
                country
            ];

        }


        return (
            this.str(
                i.region
            ).trim()
        );

    }


    //==================================================
    // BUILD COUNTRY → REGION MAP
    //==================================================

    buildCountryRegionMap() {

        const map = {};


        Object.entries(
            this.countries
        )
            .forEach(
                ([
                    region,
                    countries
                ]) => {


                    if (
                        !Array.isArray(
                            countries
                        )
                    ) {

                        return;

                    }


                    countries.forEach(
                        country => {

                            map[
                                country
                            ] =
                                region;

                        }
                    );

                }
            );


        return map;

    }


    //==================================================
    // BUILD EVENT → DOMAIN MAP
    //==================================================

    buildEventDomainMap() {

        const map = {};


        Object.entries(
            this.eventTypes
        )
            .forEach(
                ([
                    domain,
                    events
                ]) => {


                    if (
                        !Array.isArray(
                            events
                        )
                    ) {

                        return;

                    }


                    events.forEach(
                        event => {


                            map[
                                event
                            ] ??= [];


                            map[
                                event
                            ]
                                .push(
                                    domain
                                );

                        }
                    );

                }
            );


        return map;

    }


    //==================================================
    // AUTHORITATIVE SUGGESTED THRESHOLD
    //==================================================

    resolveSuggestedThreshold(i) {

        const decisionContext = {

            ...i,


            fatalities:
                this.num(
                    i.casualties
                        ?.fatalities
                ),


            injuries:
                this.num(
                    i.casualties
                        ?.injuries
                )

        };


        /*
         * Page 2 uses operational policy rules.
         *
         * Full quantitative risk scoring occurs
         * on Page 3.
         *
         * A score of 0 here is intentional.
         */


        const decision =
            this.thresholdEngine.evaluate(
                decisionContext,
                0
            );


        return (
            decision?.action ||
            decision?.level ||
            "SIGNAL"
        );

    }


    //==================================================
    // INFRASTRUCTURE IMPACT
    //==================================================

    resolveInfrastructureImpact(i) {

        const supplied =
            this.normalizeInfrastructure(
                i.infrastructureImpact
            );


        //==================================================
        // Respect explicit meaningful assessment
        //==================================================

        if (
            supplied === "Severe" ||
            supplied === "Moderate" ||
            supplied === "Minor"
        ) {

            return supplied;

        }


        //==================================================
        // Infrastructure
        //==================================================

        const infrastructure =
            this.array(
                i.criticalInfrastructure
            );


        if (
            infrastructure.length === 0
        ) {

            return "None";

        }


        //==================================================
        // Casualties
        //==================================================

        const fatalities =
            this.num(
                i.casualties
                    ?.fatalities
            );


        const injuries =
            this.num(
                i.casualties
                    ?.injuries
            );


        //==================================================
        // Classification
        //==================================================

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


        //==================================================
        // Threat / weapons
        //==================================================

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


        const combined =
            [

                eventType,

                threatText,

                weaponText

            ]
                .join(" ");


        //==================================================
        // KINETIC INDICATORS
        //==================================================

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

            "firearm",

            "armed assault",

            "missile",

            "rocket",

            "drone strike",

            "airstrike"

        ];


        const kinetic =
            kineticIndicators.some(
                indicator =>
                    combined.includes(
                        indicator
                    )
            );


        const terrorism =
            domain ===
            "terrorism";


        //==================================================
        // SEVERE
        //
        // Critical infrastructure +
        // major casualty kinetic/terrorism event.
        //==================================================

        if (
            (
                kinetic ||
                terrorism
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
        // kinetic / terrorism incident.
        //==================================================

        if (
            kinetic ||
            terrorism
        ) {

            return "Moderate";

        }


        //==================================================
        // MINOR
        //
        // Critical infrastructure identified,
        // but no stronger impact condition.
        //==================================================

        return "Minor";

    }


    //==================================================
    // CONFIDENCE
    //==================================================

    calculateConfidence(i) {

        let score =
            20;


        if (
            i.summary
        ) {

            score += 10;

        }


        if (
            i.eventType
        ) {

            score += 15;

        }


        if (
            i.domain
        ) {

            score += 15;

        }


        if (
            i.region
        ) {

            score += 10;

        }


        if (
            i.country
        ) {

            score += 10;

        }


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


    //==================================================
    // CATEGORY
    //==================================================

    calculateCategory(i) {

        const categories = {

            "Terrorism":
                "Security",

            "Crime":
                "Violent Crime",

            "Organized Crime":
                "Organized Crime",

            "Cyber Security":
                "Technology",

            "Political":
                "Political",

            "Weather":
                "Natural Hazard",

            "Public Health":
                "Public Health"

        };


        return (
            categories[
                i.domain
            ] ||
            i.domain ||
            "General"
        );

    }


    //==================================================
    // REASONING
    //==================================================

    generateReasoning(i) {

        return (

            `AI identified a ${i.eventType} incident ` +

            `in ${i.country}. ` +

            `ODIP policy classified the suggested threshold as ` +

            `${i.suggestedThreshold} based on validated casualty, ` +

            `infrastructure and event intelligence.`

        );

    }


    //==================================================
    // INFRASTRUCTURE NORMALIZATION
    //==================================================

    normalizeInfrastructure(value) {

        const allowed = [

            "None",

            "Minor",

            "Moderate",

            "Severe"

        ];


        const cleaned =
            this.str(
                value
            ).trim();


        const match =
            allowed.find(
                item =>
                    item
                        .toLowerCase() ===
                    cleaned
                        .toLowerCase()
            );


        return (
            match ||
            "None"
        );

    }


    //==================================================
    // LOAD JSON
    //==================================================

    loadJson(
        filename,
        fallback
    ) {

        try {

            const file =
                path.join(
                    this.taxonomyPath,
                    filename
                );


            return JSON.parse(
                fs.readFileSync(
                    file,
                    "utf8"
                )
            );

        }
        catch (error) {

            console.error(

                `Unable to load taxonomy ${filename}:`,

                error.message

            );


            return fallback;

        }

    }


    //==================================================
    // STRING UTILITY
    //==================================================

    str(v) {

        if (
            v === null ||
            v === undefined
        ) {

            return "";

        }


        return String(v);

    }


    //==================================================
    // NUMBER UTILITY
    //==================================================

    num(v) {

        const n =
            Number(v);


        return Number.isFinite(
            n
        )
            ? n
            : 0;

    }


    //==================================================
    // ARRAY UTILITY
    //==================================================

    array(v) {

        if (!v) {

            return [];

        }


        if (
            Array.isArray(
                v
            )
        ) {

            return v
                .map(
                    item =>
                        this.str(
                            item
                        )
                            .trim()
                )
                .filter(
                    Boolean
                );

        }


        if (
            typeof v === "string" &&
            v.trim()
        ) {

            return v
                .split(",")
                .map(
                    item =>
                        item.trim()
                )
                .filter(
                    Boolean
                );

        }


        return [v];

    }

}


module.exports =
    ValidatorV2;