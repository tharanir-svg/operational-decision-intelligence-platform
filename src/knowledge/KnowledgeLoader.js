const fs = require("fs");
const path = require("path");

class KnowledgeLoader {

    constructor(basePath = "./knowledge") {
        this.basePath = basePath;
    }

    loadJson(relativePath) {

        const fullPath = path.join(this.basePath, relativePath);

        if (!fs.existsSync(fullPath)) {
            throw new Error(
                `Knowledge file not found: ${fullPath}`
            );
        }

        try {
            return JSON.parse(
                fs.readFileSync(fullPath, "utf8")
            );
        } catch (err) {
            throw new Error(
                `Failed to parse JSON: ${fullPath}\n${err.message}`
            );
        }

    }

    loadKnowledgeBase() {

        return {

            // ============================================================
            // CORE KNOWLEDGE BASE
            // ============================================================

            entities:
                this.loadJson("entities/entity-types.json"),

            events:
                this.loadJson("events/event-types.json"),

            modifiers:
                this.loadJson("modifiers/modifier-types.json"),

            relationships:
                this.loadJson("relationships/relationship-types.json"),

            // ============================================================
            // ENTERPRISE TAXONOMY
            // ============================================================

            taxonomy: {

                metadata:
                    this.loadJson("taxonomy/metadata.json"),

                domains:
                    this.loadJson("taxonomy/domains.json"),

                regions:
                    this.loadJson("taxonomy/regions.json"),

                countries:
                    this.loadJson("taxonomy/countries.json"),

                eventTypes:
                    this.loadJson("taxonomy/event-types.json"),

                criticalSectors:
                    this.loadJson("taxonomy/critical-sectors.json"),

                infrastructure:
                    this.loadJson("taxonomy/infrastructure.json"),

                threatActors:
                    this.loadJson("taxonomy/threat-actors.json")

            },

            // ============================================================
            // POLICY ENGINE
            // ============================================================

            policies:
                this.loadJson("policies/policy-library.json"),

            thresholds:
                this.loadJson("policies/threshold-matrix.json"),

            recommendations:
                this.loadJson("policies/recommendation-library.json"),

            overrideRules:
                this.loadJson("policies/override-rules.json"),

            // ============================================================
            // SUPPORTING DATA
            // ============================================================

            regions:
                this.loadJson("regions/region-risk-profile.json"),

            weights:
                this.loadJson("modifiers/impact-weights.json")

        };

    }

}

module.exports = KnowledgeLoader;