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

            // -----------------------------
            // Knowledge Base
            // -----------------------------

            entities:
                this.loadJson("entities/entity-types.json"),

            events:
                this.loadJson("events/event-types.json"),

            modifiers:
                this.loadJson("modifiers/modifier-types.json"),

            relationships:
                this.loadJson("relationships/relationship-types.json"),

            // -----------------------------
            // Policy Engine
            // -----------------------------

            policies:
                this.loadJson("policies/policy-library.json"),

            thresholds:
                this.loadJson("policies/threshold-matrix.json"),

            recommendations:
                this.loadJson("policies/recommendation-library.json"),

            // NEW
            overrideRules:
                this.loadJson("policies/override-rules.json"),

            // -----------------------------
            // Supporting Data
            // -----------------------------

            regions:
                this.loadJson("regions/region-risk-profile.json"),

            weights:
                this.loadJson("modifiers/impact-weights.json")

        };

    }

}

module.exports = KnowledgeLoader;