const BaseEngine =
    require("./BaseEngine");

class InfrastructureEngine
    extends BaseEngine {

    constructor() {

        super("InfrastructureEngine");

    }

    process(context) {

        return context;

    }

}

module.exports =
    InfrastructureEngine;