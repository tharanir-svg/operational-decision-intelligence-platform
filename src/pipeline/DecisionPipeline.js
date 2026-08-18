const PipelineResult = require("./PipelineResult");

class DecisionPipeline {

    constructor(registry) {

        this.registry = registry;

    }

    async execute(context) {

        const result = new PipelineResult(context);

        const start = Date.now();

        for (const stage of this.registry.getStages()) {

            try {

                context.addAudit(

                    `Starting ${stage.name}`

                );

                await stage.execute(context);

                context.addAudit(

                    `Completed ${stage.name}`

                );

            }

            catch (error) {

                result.addError({

                    stage: stage.name,

                    message: error.message,

                    stack: error.stack

                });

                context.addAudit(

                    `Failed ${stage.name}`,

                    {

                        error: error.message

                    }

                );

                break;

            }

        }

        result.executionTime =

            Date.now() - start;

        return result;

    }

}

module.exports = DecisionPipeline;