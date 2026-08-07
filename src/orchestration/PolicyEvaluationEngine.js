class PolicyEvaluationEngine {

    matches(rule, context) {

        if (!rule)
            return false;

        //---------------------------------------
        // ALL
        //---------------------------------------

        if (rule.all) {

            return rule.all.every(r =>
                this.matches(r, context)
            );

        }

        //---------------------------------------
        // ANY
        //---------------------------------------

        if (rule.any) {

            return rule.any.some(r =>
                this.matches(r, context)
            );

        }

        //---------------------------------------
        // NOT
        //---------------------------------------

        if (rule.not) {

            return !this.matches(
                rule.not,
                context
            );

        }

        //---------------------------------------
        // Leaf Rule
        //---------------------------------------

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

                if (Array.isArray(value))
                    return value.includes(
                        rule.value
                    );

                if (typeof value === "string")
                    return value.includes(
                        rule.value
                    );

                return false;

            case "exists":

                return value !== undefined &&
                       value !== null;

            case "in":

                return Array.isArray(rule.value) &&
                       rule.value.includes(value);

            case "notIn":

                return Array.isArray(rule.value) &&
                       !rule.value.includes(value);

            default:

                return false;

        }

    }

    getValue(object, path) {

        return path
            .split(".")
            .reduce(

                (o, p) =>

                    o ? o[p] : undefined,

                object

            );

    }

}

module.exports =
    PolicyEvaluationEngine;