class AutoPopulationEngine {

    constructor(extraction = {}) {

        this.data = extraction || {};

    }

    //-----------------------------------------
    // Safe value helper
    //-----------------------------------------

    value(field) {

        const item = this.data[field];

        if (item == null)
            return "";

        if (typeof item === "string")
            return item;

        if (typeof item === "number")
            return item;

        if (Array.isArray(item))
            return item.join(", ");

        if (typeof item === "object") {

            return (

                item.canonical ??

                item.input ??

                item.value ??

                ""

            );

        }

        return "";

    }

    //-----------------------------------------
    // Arrays
    //-----------------------------------------

    list(field) {

        const item = this.data[field];

        if (!item)
            return [];

        if (Array.isArray(item))
            return item;

        return [];

    }

    //-----------------------------------------
    // Casualties
    //-----------------------------------------

    fatalities() {

        return (

            this.data.casualties?.fatalities ??

            this.data.fatalities ??

            0

        );

    }

    injuries() {

        return (

            this.data.casualties?.injuries ??

            this.data.injuries ??

            0

        );

    }

    //-----------------------------------------
    // Confidence
    //-----------------------------------------

    confidence() {

        return (

            this.data.confidence ??

            this.data.confidenceAssessment?.score ??

            0

        );

    }

    //-----------------------------------------
    // Infrastructure
    //-----------------------------------------

    infrastructureImpact() {

        return (

            this.value("infrastructureImpact") ||

            this.value("infrastructure") ||

            "None"

        );

    }

}

window.AutoPopulationEngine = AutoPopulationEngine;