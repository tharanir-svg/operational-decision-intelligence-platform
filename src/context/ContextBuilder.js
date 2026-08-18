const DecisionContext = require("./DecisionContext");

class ContextBuilder {

    create(evidence) {

        const context = new DecisionContext();

        context.evidence = evidence;

        context.addAudit("Evidence Loaded");

        return context;

    }

}

module.exports = ContextBuilder;