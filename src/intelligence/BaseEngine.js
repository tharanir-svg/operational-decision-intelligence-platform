class BaseEngine {

    constructor(name) {

        this.name = name;

    }

    process(context) {

        throw new Error(

            `${this.name} must implement process().`

        );

    }

}

module.exports = BaseEngine;