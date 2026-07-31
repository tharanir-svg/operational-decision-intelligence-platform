class PipelineStage {

    constructor(name) {

        this.name = name;

    }

    async execute(context) {

        throw new Error(

            `${this.name} must implement execute()`

        );

    }

}

module.exports = PipelineStage;