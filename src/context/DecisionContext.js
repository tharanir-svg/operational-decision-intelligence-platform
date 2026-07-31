class DecisionContext {

    constructor() {

        this.metadata = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            version: "1.0"
        };

        this.evidence = {};

        this.extraction = {};

        this.taxonomy = {};

        this.enrichment = {};

        this.risk = {};

        this.policy = {};

        this.decision = {};

        this.explanation = {};

        this.audit = [];

    }

    addAudit(step, details = {}) {

        this.audit.push({
            timestamp: new Date().toISOString(),
            step,
            details
        });

    }

}

module.exports = DecisionContext;