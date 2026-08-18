const fs = require("fs");
const path = require("path");

class KnowledgeManager {

    constructor(rootPath) {

        this.rootPath = rootPath;
        this.cache = {};

    }

    load(name, relativePath) {

        const fullPath = path.join(
            this.rootPath,
            relativePath
        );

        if (!fs.existsSync(fullPath)) {

            throw new Error(
                `Knowledge file missing: ${relativePath}`
            );

        }

        this.cache[name] = JSON.parse(
            fs.readFileSync(fullPath, "utf8")
        );

    }

    get(name) {

        return this.cache[name];

    }

    has(name) {

        return Object.prototype.hasOwnProperty.call(
            this.cache,
            name
        );

    }

    reload(name, relativePath) {

        delete this.cache[name];

        this.load(name, relativePath);

    }

}

module.exports = KnowledgeManager;