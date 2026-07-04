class ExtractionValidator {

    validate(data) {

        if (!data.summary)
            throw new Error("Summary missing");

        if (!data.eventType)
            throw new Error("Event type missing");

        if (!data.region)
            throw new Error("Region missing");

        if (!data.domain)
            throw new Error("Domain missing");

        return data;
    }

}

module.exports = ExtractionValidator;