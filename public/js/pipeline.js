/*
==========================================================
ODIP Pipeline Module
Sprint 5A
Dynamic Taxonomy Loader
==========================================================
*/

const Pipeline = {

    currentStep: 0,

    taxonomy: null,

    async initialize() {

        try {

            console.log("Loading Enterprise Taxonomy...");

            this.taxonomy = await API.getTaxonomy();

            this.populateRegions();

            this.populateDomains();

            this.attachDomainListeners();

            console.log("✓ Enterprise Taxonomy Loaded");

        }
        catch (error) {

            console.error("Failed to load taxonomy:", error);

        }

    },

    //-----------------------------------------------------
    // REGION
    //-----------------------------------------------------

    populateRegions() {

        const ids = [
            "ev-region",
            "ip-region",
            "region"
        ];

        ids.forEach(id => {

            const select = document.getElementById(id);

            if (!select) return;

            select.innerHTML =
                `<option value="">— Select Region —</option>`;

            this.taxonomy.regions.forEach(region => {

                select.add(
                    new Option(region, region)
                );

            });

        });

    },

    //-----------------------------------------------------
    // DOMAIN
    //-----------------------------------------------------

    populateDomains() {

        const ids = [
            "ev-domain",
            "ip-domain",
            "domain"
        ];

        ids.forEach(id => {

            const select = document.getElementById(id);

            if (!select) return;

            select.innerHTML =
                `<option value="">— Select Domain —</option>`;

            this.taxonomy.domains.forEach(domain => {

                select.add(
                    new Option(domain, domain)
                );

            });

        });

    },

    //-----------------------------------------------------
    // EVENT TYPES
    //-----------------------------------------------------

    populateEventTypes(domain, targetId) {

        const select =
            document.getElementById(targetId);

        if (!select) return;

        select.innerHTML = "";

        if (!domain || !this.taxonomy.eventTypes[domain]) {

            select.disabled = true;

            select.add(
                new Option(
                    "— Select Domain First —",
                    ""
                )
            );

            return;

        }

        select.disabled = false;

        select.add(
            new Option(
                "— Select Event Type —",
                ""
            )
        );

        this.taxonomy.eventTypes[domain]
            .forEach(eventType => {

                select.add(
                    new Option(eventType, eventType)
                );

            });

    },

    //-----------------------------------------------------
    // LISTENERS
    //-----------------------------------------------------

    attachDomainListeners() {

        const mappings = [

            {
                domain: "ev-domain",
                event: "ev-eventType"
            },

            {
                domain: "domain",
                event: "eventType"
            }

        ];

        mappings.forEach(pair => {

            const domainSelect =
                document.getElementById(pair.domain);

            if (!domainSelect) return;

            domainSelect.addEventListener("change", e => {

                this.populateEventTypes(
                    e.target.value,
                    pair.event
                );

            });

        });

    },

    //-----------------------------------------------------

    setStep(step) {

        this.currentStep = step;

        console.log(
            "Pipeline Step:",
            step
        );

    },

    next() {

        this.setStep(
            this.currentStep + 1
        );

    },

    previous() {

        this.setStep(
            Math.max(
                0,
                this.currentStep - 1
            )
        );

    },

    reset() {

        this.setStep(0);

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => Pipeline.initialize()
);

console.log("✓ pipeline.js loaded");