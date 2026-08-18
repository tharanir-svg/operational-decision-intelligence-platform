class PolicyEvaluationEngine {

    matches(rule, context) {

        if (!rule) {
            return false;
        }

        // ---------------------------------------
        // ALL
        // ---------------------------------------

        if (Array.isArray(rule.all)) {

            return rule.all.every(r =>
                this.matches(r, context)
            );

        }

        // ---------------------------------------
        // ANY
        // ---------------------------------------

        if (Array.isArray(rule.any)) {

            return rule.any.some(r =>
                this.matches(r, context)
            );

        }

        // ---------------------------------------
        // NOT
        // ---------------------------------------

        if (rule.not) {

            return !this.matches(
                rule.not,
                context
            );

        }

        // ---------------------------------------
        // Leaf rule
        // ---------------------------------------

        const value =
            this.getValue(
                context,
                rule.field
            );

        switch (rule.operator) {

            case "equals":

                return value === rule.value;


            case "notEquals":

                return value !== rule.value;


            case "greaterThan":

                return Number(value) >
                    Number(rule.value);


            case "greaterThanOrEqual":

                return Number(value) >=
                    Number(rule.value);


            case "lessThan":

                return Number(value) <
                    Number(rule.value);


            case "lessThanOrEqual":

                return Number(value) <=
                    Number(rule.value);


            case "contains":

                if (Array.isArray(value)) {

                    return value.includes(
                        rule.value
                    );

                }

                if (typeof value === "string") {

                    return value.includes(
                        rule.value
                    );

                }

                return false;


            case "nonEmpty":

                if (Array.isArray(value)) {

                    return value.length > 0;

                }

                if (typeof value === "string") {

                    return value.trim().length > 0;

                }

                return (
                    value !== undefined &&
                    value !== null
                );


            case "exists":

                return (
                    value !== undefined &&
                    value !== null
                );


            case "in":

                return (
                    Array.isArray(rule.value) &&
                    rule.value.includes(value)
                );


            case "notIn":

                return (
                    Array.isArray(rule.value) &&
                    !rule.value.includes(value)
                );


            default:

                return false;

        }

    }


    getValue(object, path) {

        if (!object || !path) {
            return undefined;
        }

        return String(path)
            .split(".")
            .reduce(
                (current, property) =>
                    current !== undefined &&
                    current !== null
                        ? current[property]
                        : undefined,
                object
            );

    }

}


module.exports =
    PolicyEvaluationEngine;