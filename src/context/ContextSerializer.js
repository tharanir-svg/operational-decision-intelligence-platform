class ContextSerializer {

    toJSON(context) {

        return JSON.stringify(context, null, 2);

    }

}

module.exports = ContextSerializer;