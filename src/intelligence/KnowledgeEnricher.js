const fs = require("fs");
const path = require("path");

class KnowledgeEnricher {

    constructor() {

        this.knowledgePath = path.join(
            process.cwd(),
            "knowledge",
            "taxonomy"
        );

        this.cache = {};

        this.loadKnowledge();

    }

    //-----------------------------------------------------
    // Load taxonomy datasets once
    //-----------------------------------------------------

    loadKnowledge() {

        const datasets = [

            "threat-actors",

            "critical-sectors",

            "infrastructure",

            "domains",

            "event-types",

            "countries",

            "regions"

        ];

        datasets.forEach(dataset => {

            try {

                const file = path.join(
                    this.knowledgePath,
                    `${dataset}.json`
                );

                if (fs.existsSync(file)) {

                    this.cache[dataset] =
                        JSON.parse(
                            fs.readFileSync(file, "utf8")
                        );

                }

                else {

                    this.cache[dataset] = {};

                }

            }

            catch (err) {

                console.error(

                    `Unable to load ${dataset}`,

                    err

                );

                this.cache[dataset] = {};

            }

        });

    }

    //-----------------------------------------------------
    // Public API
    //-----------------------------------------------------

    enrich(taxonomy) {

        return {

            geography:
                this.enrichGeography(taxonomy),

            domain:
                this.enrichDomain(taxonomy),

            event:
                this.enrichEvent(taxonomy),

            threatActors:
                this.enrichThreatActors(taxonomy),

            infrastructure:
                this.enrichInfrastructure(taxonomy),

            criticalSectors:
                this.enrichCriticalSectors(taxonomy)

        };

    }

    //-----------------------------------------------------
    // Geography
    //-----------------------------------------------------

    enrichGeography(taxonomy) {

        return {

            region:
                taxonomy.region?.canonical,

            country:
                taxonomy.country?.canonical

        };

    }

    //-----------------------------------------------------
    // Domain
    //-----------------------------------------------------

    enrichDomain(taxonomy) {

        const domain =
            taxonomy.domain?.canonical;

        if (!domain)
            return {};

        return (

            this.cache.domains[domain]

            ||

            {}

        );

    }

    //-----------------------------------------------------
    // Event
    //-----------------------------------------------------

    enrichEvent(taxonomy) {

        const event =
            taxonomy.eventType?.canonical;

        if (!event)
            return {};

        return (

            this.cache["event-types"][event]

            ||

            {}

        );

    }

    //-----------------------------------------------------
    // Threat Actors
    //-----------------------------------------------------

    enrichThreatActors(taxonomy) {

        const domain =
            taxonomy.domain?.canonical;

        if (!domain)
            return [];

        const db =
            this.cache["threat-actors"];

        if (!db[domain])
            return [];

        return db[domain];

    }

    //-----------------------------------------------------
    // Infrastructure
    //-----------------------------------------------------

    enrichInfrastructure(taxonomy) {

        const domain =
            taxonomy.domain?.canonical;

        if (!domain)
            return [];

        const db =
            this.cache.infrastructure;

        if (!db[domain])
            return [];

        return db[domain];

    }

    //-----------------------------------------------------
    // Critical Sectors
    //-----------------------------------------------------

    enrichCriticalSectors(taxonomy) {

        const domain =
            taxonomy.domain?.canonical;

        if (!domain)
            return [];

        const db =
            this.cache["critical-sectors"];

        if (!db[domain])
            return [];

        return db[domain];

    }

}

module.exports = KnowledgeEnricher;