const { NormalizationEngine } = require("../normalization");

class TaxonomyMatcher {

    constructor() {
        this.normalizer = new NormalizationEngine();
    }

    match(extractedData = {}) {

        console.log("\n========================================");
        console.log("TAXONOMY MATCHER START");
        console.log("========================================");

        console.log("\nRAW EXTRACTED DATA");
        console.dir(extractedData, { depth: null });

        const taxonomy = {};

        //-----------------------------------------------------
        // Region
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("REGION");
        console.log("------------------------------");
        console.log("Input :", extractedData.region);

        taxonomy.region =
            this.normalizer.normalizeRegion(
                extractedData.region
            );

        console.dir(taxonomy.region, { depth: null });

        //-----------------------------------------------------
        // Country
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("COUNTRY");
        console.log("------------------------------");
        console.log("Input :", extractedData.country);

        taxonomy.country =
            this.normalizer.normalizeCountry(
                extractedData.country
            );

        console.dir(taxonomy.country, { depth: null });

        //-----------------------------------------------------
        // Domain
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("DOMAIN");
        console.log("------------------------------");
        console.log("Input :", extractedData.domain);

        taxonomy.domain =
            this.normalizer.normalizeDomain(
                extractedData.domain
            );

        console.dir(taxonomy.domain, { depth: null });

        //-----------------------------------------------------
        // Event Type
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("EVENT TYPE");
        console.log("------------------------------");
        console.log("Input :", extractedData.eventType);

        taxonomy.eventType =
            this.normalizer.normalizeEventType(
                extractedData.eventType
            );

        console.dir(taxonomy.eventType, { depth: null });

        //-----------------------------------------------------
        // Threat Actor
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("THREAT ACTOR");
        console.log("------------------------------");
        console.log("Input :", extractedData.threatActor);

        taxonomy.threatActor =
            this.normalizer.normalizeThreatActor(
                extractedData.threatActor
            );

        console.dir(taxonomy.threatActor, { depth: null });

        //-----------------------------------------------------
        // Critical Sector
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("CRITICAL SECTOR");
        console.log("------------------------------");
        console.log("Input :", extractedData.criticalSector);

        taxonomy.criticalSector =
            this.normalizer.normalizeCriticalSector(
                extractedData.criticalSector
            );

        console.dir(taxonomy.criticalSector, { depth: null });

        //-----------------------------------------------------
        // Infrastructure
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("INFRASTRUCTURE");
        console.log("------------------------------");
        console.log("Input :", extractedData.infrastructure);

        taxonomy.infrastructure =
            this.normalizer.normalizeInfrastructure(
                extractedData.infrastructure
            );

        console.dir(taxonomy.infrastructure, { depth: null });

        //-----------------------------------------------------
        // Organization
        //-----------------------------------------------------

        console.log("\n------------------------------");
        console.log("ORGANIZATION");
        console.log("------------------------------");
        console.log("Input :", extractedData.organization);

        taxonomy.organization =
            this.normalizer.normalizeOrganization(
                extractedData.organization
            );

        console.dir(taxonomy.organization, { depth: null });

        //-----------------------------------------------------
        // Summary
        //-----------------------------------------------------

        taxonomy.summary =
            this.buildSummary(taxonomy);

        console.log("\n========================================");
        console.log("MATCH SUMMARY");
        console.log("========================================");
        console.dir(taxonomy.summary, { depth: null });

        console.log("\n========================================");
        console.log("FINAL TAXONOMY");
        console.log("========================================");
        console.dir(taxonomy, { depth: null });

        return taxonomy;
    }

    buildSummary(results) {

        const values = Object.values(results)
            .filter(v => v && v.confidence !== undefined);

        const matched =
            values.filter(v => v.matched).length;

        const confidence =
            values.length === 0
                ? 0
                : Math.round(
                    values.reduce(
                        (sum, item) => sum + item.confidence,
                        0
                    ) / values.length
                );

        return {

            totalFields: values.length,

            matched,

            unmatched:
                values.length - matched,

            confidence,

            completion:
                values.length === 0
                    ? 0
                    : Math.round(
                        matched / values.length * 100
                    )

        };

    }

}

module.exports = TaxonomyMatcher;