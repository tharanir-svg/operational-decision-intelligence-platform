class KnowledgeExtractor {

    extract(intelligence) {

        return {

            countries: intelligence.country
                ? [intelligence.country]
                : [],

            cities: intelligence.location
                ? [intelligence.location]
                : [],

            organizations: [],

            people: [],

            groups: [],

            weapons: intelligence.weapons || [],

            criticalInfrastructure:
                intelligence.criticalInfrastructure || [],

            threatIndicators:
                intelligence.threatIndicators || []

        };

    }

}

module.exports = KnowledgeExtractor;