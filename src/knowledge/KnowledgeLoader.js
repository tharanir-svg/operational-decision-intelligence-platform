import fs from "fs";
import path from "path";

export default class KnowledgeLoader {
  constructor(basePath = "./knowledge") {
    this.basePath = basePath;
  }

  loadJson(relativePath) {
    const fullPath = path.join(this.basePath, relativePath);
    const data = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(data);
  }

  loadKnowledgeBase() {
    return {
      entities: this.loadJson("entities/entity-types.json"),
      events: this.loadJson("events/event-types.json"),
      modifiers: this.loadJson("modifiers/modifier-types.json"),
      relationships: this.loadJson(
        "relationships/relationship-types.json"
      ),
      policies: this.loadJson("policies/policy-library.json"),
      thresholds: this.loadJson("policies/threshold-matrix.json"),
      regions: this.loadJson("regions/region-risk-profile.json"),
      weights: this.loadJson("modifiers/impact-weights.json")
    };
  }
}
