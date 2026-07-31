const { NormalizationEngine } = require("../normalization");

class TaxonomyMatcher {

    constructor() {

        this.normalizer = new NormalizationEngine();

    }

    match(extractedData = {}) {

        const taxonomy = {};

        //-----------------------------------------------------
        // Geography
        //-----------------------------------------------------

        taxonomy.region =
            this.normalizer.normalizeRegion(
                extractedData.region
            );

        taxonomy.country =
            this.normalizer.normalizeCountry(
                extractedData.country
            );

        //-----------------------------------------------------
        // Domain
        //-----------------------------------------------------

        taxonomy.domain =
            this.normalizer.normalizeDomain(
                extractedData.domain
            );

        //-----------------------------------------------------
        // Event Type
        //-----------------------------------------------------

        taxonomy.eventType =
            this.normalizer.normalizeEventType(
                extractedData.eventType
            );

        //-----------------------------------------------------
        // Threat Actor
        //-----------------------------------------------------

        taxonomy.threatActor =
            this.normalizer.normalizeThreatActor(
                extractedData.threatActor
            );

        //-----------------------------------------------------
        // Critical Sector
        //-----------------------------------------------------

        taxonomy.criticalSector =
            this.normalizer.normalizeCriticalSector(
                extractedData.criticalSector
            );

        //-----------------------------------------------------
        // Infrastructure
        //-----------------------------------------------------

        taxonomy.infrastructure =
            this.normalizer.normalizeInfrastructure(
                extractedData.infrastructure
            );

        //-----------------------------------------------------
        // Organization
        //-----------------------------------------------------

        taxonomy.organization =
            this.normalizer.normalizeOrganization(
                extractedData.organization
            );

        //-----------------------------------------------------
        // Overall statistics
        //-----------------------------------------------------

        taxonomy.summary =
            this.buildSummary(taxonomy);

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