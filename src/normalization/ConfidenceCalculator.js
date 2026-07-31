class ConfidenceCalculator {

    static score(method) {

        switch (method) {

            case "exact":
                return 100;

            case "alias":
                return 98;

            case "abbreviation":
                return 96;

            case "misspelling":
                return 93;

            case "fuzzy":
                return 88;

            default:
                return 0;

        }

    }

}

module.exports = ConfidenceCalculator;