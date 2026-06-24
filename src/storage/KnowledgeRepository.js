const fs = require("fs");
const path = require("path");

class KnowledgeRepository {
  constructor() {
    this.basePath = path.join(__dirname, "../../knowledge");
  }

  loadJSON(relativePath) {
    const fullPath = path.join(this.basePath, relativePath);
    const raw = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(raw);
  }

  getEvents() {
    return this.loadJSON("events/event-types.json");
  }

  getEntities() {
    return this.loadJSON("entities/entity-types.json");
  }

  getPolicies() {
    return this.loadJSON("policies/policy-library.json");
  }

  getRegions() {
    return this.loadJSON("regions/region-types.json");
  }

  getRelationships() {
    return this.loadJSON("relationships/relationship-types.json");
  }
}

module.exports = KnowledgeRepository;
