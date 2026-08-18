const TaxonomyRepository = require("../storage/TaxonomyRepository");

class TaxonomyService {

    constructor() {
        this.repository = new TaxonomyRepository();
    }

    getTaxonomy() {

        const raw = this.repository.getTaxonomy();

        
        const taxonomy = {
            metadata: raw.metadata,

            domains: raw.domains?.domains ?? raw.domains ?? [],

            regions: raw.regions?.regions ?? raw.regions ?? [],

            countries: raw.countries?.countries ?? raw.countries ?? {},

            eventTypes: raw.eventTypes?.eventTypes ?? raw.eventTypes ?? {},

            criticalSectors:
                raw.criticalSectors?.criticalSectors ??
                raw.criticalSectors ??
                [],

            infrastructure:
                raw.infrastructure?.infrastructure ??
                raw.infrastructure ??
                [],

            threatActors:
                raw.threatActors?.threatActors ??
                raw.threatActors ??
                []
        };

        
        return taxonomy;
    }

    getDomains() {
        return this.getTaxonomy().domains;
    }

    getRegions() {
        return this.getTaxonomy().regions;
    }

    getCountries() {
        return this.getTaxonomy().countries;
    }

    getEventTypes() {
        return this.getTaxonomy().eventTypes;
    }

    getCriticalSectors() {
        return this.getTaxonomy().criticalSectors;
    }

    getInfrastructure() {
        return this.getTaxonomy().infrastructure;
    }

    getThreatActors() {
        return this.getTaxonomy().threatActors;
    }

}

module.exports = TaxonomyService;