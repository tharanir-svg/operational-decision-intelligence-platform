const DecisionContext = require("./DecisionContext");

class DecisionPipeline {

    constructor() {

        this.engines = [];

    }

    register(engine) {

        this.engines.push(engine);

    }

    evaluate(extraction) {

        let context = new DecisionContext(extraction);

        for (const engine of this.engines) {

            context = engine.process(context);

            context.audit.push({

                engine: engine.constructor.name,

                timestamp: new Date().toISOString()

            });

        }

        return context;

    }

}

module.exports = DecisionPipeline;