const AliasRepository = require("./AliasRepository");
const MatchResult = require("./MatchResult");
const NormalizationUtils = require("./NormalizationUtils");
const StringSimilarity = require("./StringSimilarity");

class NormalizationEngine {

    constructor() {
        this.repository = new AliasRepository();
    }

    /**
     * Generic normalization method
     * @param {string} dataset
     * @param {string} value
     * @returns {MatchResult}
     */
    normalize(dataset, value) {

        if (!value) {
            return MatchResult.noMatch(value, dataset);
        }

        const datasets = this.repository.get(dataset);

        if (!datasets || Object.keys(datasets).length === 0) {
            return MatchResult.noMatch(value, dataset);
        }

        const input = NormalizationUtils.normalize(value);

        let bestMatch = null;
        let bestScore = 0;

        for (const canonical of Object.keys(datasets)) {

            const record = datasets[canonical] || {};

            //------------------------------------------
            // EXACT MATCH
            //------------------------------------------

            if (NormalizationUtils.equals(canonical, input)) {
                return MatchResult.exact(
                    value,
                    canonical,
                    dataset
                );
            }

            //------------------------------------------
            // ALIASES
            //------------------------------------------

            if (Array.isArray(record.aliases)) {

                for (const alias of record.aliases) {

                    if (NormalizationUtils.equals(alias, input)) {

                        return MatchResult.alias(
                            value,
                            canonical,
                            dataset
                        );

                    }

                }

            }

            //------------------------------------------
            // ABBREVIATIONS
            //------------------------------------------

            if (Array.isArray(record.abbreviations)) {

                for (const abbr of record.abbreviations) {

                    if (NormalizationUtils.equals(abbr, input)) {

                        return MatchResult.abbreviation(
                            value,
                            canonical,
                            dataset
                        );

                    }

                }

            }

            //------------------------------------------
            // COMMON MISSPELLINGS
            //------------------------------------------

            if (Array.isArray(record.misspellings)) {

                for (const miss of record.misspellings) {

                    if (NormalizationUtils.equals(miss, input)) {

                        return MatchResult.misspelling(
                            value,
                            canonical,
                            dataset
                        );

                    }

                }

            }

            //------------------------------------------
            // FUZZY MATCH
            //------------------------------------------

            const similarity =
                StringSimilarity.similarity(
                    input,
                    canonical.toLowerCase()
                );

            if (similarity > bestScore) {

                bestScore = similarity;
                bestMatch = canonical;

            }

            if (record.aliases) {

                for (const alias of record.aliases) {

                    const score =
                        StringSimilarity.similarity(
                            input,
                            alias.toLowerCase()
                        );

                    if (score > bestScore) {

                        bestScore = score;
                        bestMatch = canonical;

                    }

                }

            }

        }

        //------------------------------------------
        // Accept fuzzy matches above threshold
        //------------------------------------------

        if (bestScore >= 88) {

            return MatchResult.fuzzy(

                value,

                bestMatch,

                bestScore,

                dataset

            );

        }

        //------------------------------------------
        // No Match
        //------------------------------------------

        return MatchResult.noMatch(

            value,

            dataset

        );

    }

    //-----------------------------------------------------
    // Convenience wrappers
    //-----------------------------------------------------

    normalizeCountry(value) {

        return this.normalize(
            "countries",
            value
        );

    }

    normalizeRegion(value) {

        return this.normalize(
            "regions",
            value
        );

    }

    normalizeDomain(value) {

        return this.normalize(
            "domains",
            value
        );

    }

    normalizeEventType(value) {

        return this.normalize(
            "event-types",
            value
        );

    }

    normalizeThreatActor(value) {

        return this.normalize(
            "threat-actors",
            value
        );

    }

    normalizeInfrastructure(value) {

        return this.normalize(
            "infrastructure",
            value
        );

    }

    normalizeCriticalSector(value) {

        return this.normalize(
            "critical-sectors",
            value
        );

    }

    normalizeOrganization(value) {

        return this.normalize(
            "organizations",
            value
        );

    }

}

module.exports = NormalizationEngine;