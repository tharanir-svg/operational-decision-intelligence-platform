const fs = require("fs");
const path = require("path");

class TaxonomyRepository {

    constructor() {
        this.basePath = path.join(__dirname, "../../knowledge/taxonomy");
    }

    loadJSON(fileName) {

        const fullPath = path.join(this.basePath, fileName);

        const raw = fs.readFileSync(fullPath, "utf8");

        return JSON.parse(raw);

    }

    getMetadata() {
        return this.loadJSON("metadata.json");
    }

    getDomains() {
        return this.loadJSON("domains.json");
    }

    getRegions() {
        return this.loadJSON("regions.json");
    }

    getCountries() {
        return this.loadJSON("countries.json");
    }

    getEventTypes() {
        return this.loadJSON("event-types.json");
    }

    getCriticalSectors() {
        return this.loadJSON("critical-sectors.json");
    }

    getInfrastructure() {
        return this.loadJSON("infrastructure.json");
    }

    getThreatActors() {
        return this.loadJSON("threat-actors.json");
    }

    getTaxonomy() {

        return {

            metadata: this.getMetadata(),

            domains: this.getDomains(),

            regions: this.getRegions(),

            countries: this.getCountries(),

            eventTypes: this.getEventTypes(),

            criticalSectors: this.getCriticalSectors(),

            infrastructure: this.getInfrastructure(),

            threatActors: this.getThreatActors()

        };

    }

}

module.exports = TaxonomyRepository;