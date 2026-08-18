const express = require("express");


module.exports = function(orchestrator) {

    const router =
        express.Router();


    //==================================================
    // DECISION API
    //==================================================

    router.post(
        "/decision",
        (req, res) => {

            try {

                const input =
                    req.body;


                //==========================================
                // REQUEST VALIDATION
                //==========================================

                if (
                    !input ||
                    typeof input !== "object" ||
                    Array.isArray(input) ||
                    Object.keys(input).length === 0
                ) {

                    return res
                        .status(400)
                        .json({

                            success: false,

                            error:
                                "Decision input is required."

                        });

                }


                //==========================================
                // EVENT IDENTIFICATION VALIDATION
                //
                // A decision request must identify the
                // incident through at least a domain or
                // event type.
                //
                // This prevents arbitrary/empty payloads
                // from becoming valid SIGNAL decisions.
                //==========================================

                const domain =
                    typeof input.domain === "string"
                        ? input.domain.trim()
                        : "";


                const eventType =
                    typeof input.eventType === "string"
                        ? input.eventType.trim()
                        : "";


                if (
                    !domain &&
                    !eventType
                ) {

                    return res
                        .status(400)
                        .json({

                            success: false,

                            error:
                                "At least one of domain or eventType is required."

                        });

                }


                //==========================================
                // DECISION EVALUATION
                //==========================================

                const result =
                    orchestrator.evaluate(
                        input
                    );


                return res.json({

                    success: true,

                    timestamp:
                        new Date()
                            .toISOString(),

                    result

                });

            }

            catch (error) {

                console.error(
                    "Decision API Error:",
                    error
                );


                return res
                    .status(500)
                    .json({

                        success: false,

                        error:
                            error.message

                    });

            }

        }
    );


    return router;

};