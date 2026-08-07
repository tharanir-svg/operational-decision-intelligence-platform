const BaseEngine =
    require("./BaseEngine");

class RiskFactorEngine
    extends BaseEngine {

    constructor() {

        super("RiskFactorEngine");

    }

    process(context) {

        return context;

    }

}

module.exports =
    RiskFactorEngine;