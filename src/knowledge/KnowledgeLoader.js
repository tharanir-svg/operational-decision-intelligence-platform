const fs = require("fs");
const path = require("path");

class KnowledgeLoader {

    constructor(basePath = "./knowledge") {
        this.basePath = basePath;
    }

    loadJson(relativePath) {

        const fullPath = path.join(this.basePath, relativePath);

        return JSON.parse(
            fs.readFileSync(fullPath, "utf8")
        );

    }

    loadKnowledgeBase() {

        return {

            entities:
                this.loadJson("entities/entity-types.json"),

            events:
                this.loadJson("events/event-types.json"),

            modifiers:
                this.loadJson("modifiers/modifier-types.json"),

            relationships:
                this.loadJson("relationships/relationship-types.json"),

            policies:
                this.loadJson("policies/policy-library.json"),

            thresholds:
                this.loadJson("policies/threshold-matrix.json"),

            recommendations:
                this.loadJson("policies/recommendation-library.json"),

            regions:
                this.loadJson("regions/region-risk-profile.json"),

            weights:
                this.loadJson("modifiers/impact-weights.json")

        };

    }

}

module.exports = KnowledgeLoader;