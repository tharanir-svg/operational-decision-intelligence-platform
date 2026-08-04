const fs = require("fs");
const path = require("path");

class AliasRepository {

    constructor() {

        this.basePath = path.join(
            process.cwd(),
            "knowledge",
            "taxonomy"
        );

        this.cache = {};
        this.loaded = false;

    }

    load() {

        if (this.loaded) {
            return;
        }

        if (!fs.existsSync(this.basePath)) {

            console.warn(
                "Normalization directory not found:",
                this.basePath
            );

            return;
        }

        const files = fs.readdirSync(this.basePath);

        for (const file of files) {

            if (!file.endsWith(".json")) {
                continue;
            }

            const datasetName =
                path.basename(file, ".json");

            const fullPath =
                path.join(this.basePath, file);

            try {

                const raw =
                    JSON.parse(
                        fs.readFileSync(fullPath, "utf8")
                    );

                this.cache[datasetName] =
                    this.transformDataset(raw);

                console.log(
                    `Loaded normalization dataset: ${datasetName}`
                );

            }

            catch (err) {

                console.error(

                    `Failed loading ${file}`,

                    err.message

                );

            }

        }

        this.loaded = true;

    }

    get(dataset) {

        if (!this.loaded) {

            this.load();

        }

        return this.cache[dataset] || {};

    }

    //-------------------------------------------------------
    // Convert every taxonomy format into one lookup format
    //-------------------------------------------------------

    transformDataset(raw) {

        const output = {};

        //---------------------------------------------------
        // CASE 1
        //
        // {
        //   "domains":[
        //      "Crime",
        //      "Cyber Security"
        //   ]
        // }
        //---------------------------------------------------

        if (

            raw.domains &&
            Array.isArray(raw.domains)

        ) {

            for (const item of raw.domains) {

                output[item] = {

                    aliases: [],

                    abbreviations: [],

                    misspellings: []

                };

            }

            return output;

        }

        //---------------------------------------------------
        // CASE 2
        //
        // {
        //   "North America":[
        //      "United States",
        //      "Canada"
        //   ]
        // }
        //---------------------------------------------------

        let grouped = true;

        for (const key of Object.keys(raw)) {

            if (!Array.isArray(raw[key])) {

                grouped = false;

                break;

            }

        }

        if (grouped) {

            for (const region of Object.keys(raw)) {

                for (const country of raw[region]) {

                    output[country] = {

                        region,

                        aliases: [],

                        abbreviations: [],

                        misspellings: []

                    };

                }

            }

            return output;

        }

        //---------------------------------------------------
        // CASE 3
        //
        // Already canonical
        //---------------------------------------------------

        return raw;

    }

}

module.exports = AliasRepository;