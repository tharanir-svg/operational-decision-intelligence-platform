const fs = require("fs");
const path = require("path");

class AliasRepository {

    constructor() {

        this.basePath = path.join(
            process.cwd(),
            "knowledge",
            "normalization"
        );

        this.cache = {};

        this.loaded = false;

    }

    load() {

        if (this.loaded)
            return;

        if (!fs.existsSync(this.basePath)) {

            console.warn(
                "Normalization directory not found:",
                this.basePath
            );

            this.loaded = true;

            return;

        }

        const files = fs.readdirSync(this.basePath);

        for (const file of files) {

            if (!file.endsWith(".json"))
                continue;

            const fullPath = path.join(
                this.basePath,
                file
            );

            try {

                const json =
                    JSON.parse(
                        fs.readFileSync(
                            fullPath,
                            "utf8"
                        )
                    );

                const key =
                    file.replace(".json", "");

                this.cache[key] = json;

                console.log(
                    `Loaded normalization dataset: ${key}`
                );

            } catch (err) {

                console.error(
                    `Failed loading ${file}`,
                    err
                );

            }

        }

        this.loaded = true;

    }

    get(dataset) {

        this.load();

        return this.cache[dataset] || {};

    }

    has(dataset) {

        this.load();

        return dataset in this.cache;

    }

    list() {

        this.load();

        return Object.keys(this.cache);

    }

}

module.exports = AliasRepository;