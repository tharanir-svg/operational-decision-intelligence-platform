const BaseEngine =
    require("./BaseEngine");

const PolicyEvaluationEngine =
    require("../orchestration/PolicyEvaluationEngine");


class RiskFactorEngine
    extends BaseEngine {

    constructor(
        knowledgeManager
    ) {

        super(
            "RiskFactorEngine"
        );


        this.knowledgeManager =
            knowledgeManager;


        this.evaluator =
            new PolicyEvaluationEngine();

    }


    //==================================================
    // Process Risk Factors
    //==================================================

    process(context) {

        if (!context) {

            throw new Error(
                "RiskFactorEngine requires a DecisionContext."
            );

        }


        if (
            !this.knowledgeManager
        ) {

            throw new Error(
                "RiskFactorEngine requires a KnowledgeManager."
            );

        }


        const library =
            this.knowledgeManager.get(
                "riskFactors"
            );


        if (!library) {

            throw new Error(
                "Risk factor knowledge has not been loaded."
            );

        }


        const factors =
            Array.isArray(
                library.riskFactors
            )
                ? library.riskFactors
                : [];


        context.riskFactors =
            [];


        //==================================================
        // Evaluate Every Knowledge Factor
        //==================================================

        for (
            const factor of
            factors
        ) {

            if (
                !factor ||
                !factor.rule
            ) {

                continue;

            }


            const matched =
                this.evaluator.matches(
                    factor.rule,
                    context
                );


            if (!matched) {

                continue;

            }


            //==============================================
            // Resolve observed value
            //==============================================

            const valueField =
                factor.valueField ||
                factor.rule.field;


            const observedValue =
                this.evaluator.getValue(
                    context,
                    valueField
                );


            //==============================================
            // Resolve points
            //==============================================

            let points =
                Number(
                    factor.points
                ) || 0;


            //------------------------------------------
            // Dynamic points:
            // observed value × points per unit
            //------------------------------------------

            if (
                factor.pointsPerUnit !==
                undefined
            ) {

                const numericValue =
                    Number(
                        observedValue
                    ) || 0;


                const pointsPerUnit =
                    Number(
                        factor.pointsPerUnit
                    ) || 0;


                points =
                    numericValue *
                    pointsPerUnit;

            }


            //------------------------------------------
            // Optional future minimum
            //------------------------------------------

            if (
                factor.minimumPoints !==
                undefined
            ) {

                points =
                    Math.max(
                        points,
                        Number(
                            factor.minimumPoints
                        ) || 0
                    );

            }


            //------------------------------------------
            // Optional future maximum
            //------------------------------------------

            if (
                factor.maximumPoints !==
                undefined
            ) {

                points =
                    Math.min(
                        points,
                        Number(
                            factor.maximumPoints
                        ) || 0
                    );

            }


            //------------------------------------------
            // Never allow negative contribution
            //------------------------------------------

            points =
                Math.max(
                    points,
                    0
                );


            //==============================================
            // Add Risk Factor
            //==============================================

            context.riskFactors.push({

                id:
                    factor.id ||
                    "",

                name:
                    factor.name ||
                    "Unnamed Risk Factor",

                value:
                    observedValue ??
                    null,

                points,

                reason:
                    factor.reason ||
                    "",

                source:
                    "risk-factor-library"

            });

        }


        return context;

    }

}


module.exports =
    RiskFactorEngine;