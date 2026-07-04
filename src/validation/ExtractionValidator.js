class ExtractionValidator {

    validate(extraction) {

        const errors = [];

        if (!extraction) {
            errors.push("Extraction is empty.");
        }

        if (!extraction.eventType) {
            errors.push("Missing eventType.");
        }

        if (!extraction.region) {
            errors.push("Missing region.");
        }

        if (!extraction.domain) {
            errors.push("Missing domain.");
        }

        if (typeof extraction.fatalities !== "number") {
            errors.push("fatalities must be a number.");
        }

        if (typeof extraction.injuries !== "number") {
            errors.push("injuries must be a number.");
        }

        if (
            extraction.confidence !== undefined &&
            (extraction.confidence < 0 || extraction.confidence > 1)
        ) {
            errors.push("confidence must be between 0 and 1.");
        }

        return {
            valid: errors.length === 0,
            errors
        };

    }

}

module.exports = ExtractionValidator;
