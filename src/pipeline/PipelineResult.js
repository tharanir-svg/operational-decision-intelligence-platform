class PipelineResult {

    constructor(context) {

        this.success = true;

        this.context = context;

        this.errors = [];

        this.executionTime = 0;

    }

    addError(error) {

        this.success = false;

        this.errors.push(error);

    }

}

module.exports = PipelineResult;