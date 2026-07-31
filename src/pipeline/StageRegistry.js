class StageRegistry {

    constructor() {

        this.stages = [];

    }

    register(stage) {

        this.stages.push(stage);

    }

    getStages() {

        return this.stages;

    }

}

module.exports = StageRegistry;