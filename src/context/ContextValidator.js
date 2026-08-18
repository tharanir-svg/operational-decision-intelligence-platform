class ContextValidator {

    validate(context) {

        const errors = [];

        if (!context.evidence)
            errors.push("Evidence missing");

        if (!context.extraction)
            errors.push("Extraction missing");

        if (!context.taxonomy)
            errors.push("Taxonomy missing");

        return {

            valid: errors.length === 0,

            errors

        };

    }

}

module.exports = ContextValidator;