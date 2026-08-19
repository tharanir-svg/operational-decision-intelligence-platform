const express =
    require("express");

const GeminiClient =
    require("../ai/GeminiClient");

const ServiceV2 =
    require("../extraction/ServiceV2");


module.exports =
function createExtractAPIV2() {

    const router =
        express.Router();


    //==================================================
    // LAZY AI SERVICE
    //
    // Gemini is created only when AI extraction is
    // actually requested and available.
    //==================================================

    let extractionService =
        null;


    //==================================================
    // AI CONFIGURATION
    //==================================================

    function isAIEnabled() {

        const configured =
            process.env.AI_ENABLED;


        if (
            configured === undefined ||
            configured === null ||
            configured === ""
        ) {

            return true;

        }


        return (
            String(configured)
                .trim()
                .toLowerCase()
            !== "false"
        );

    }


    function hasGeminiKey() {

        return Boolean(
            process.env.GEMINI_API_KEY &&
            process.env.GEMINI_API_KEY.trim()
        );

    }


    function isAIAvailable() {

        return (
            isAIEnabled() &&
            hasGeminiKey()
        );

    }


    //==================================================
    // CREATE AI SERVICE ONLY WHEN REQUIRED
    //==================================================

    function getExtractionService() {

        if (
            !isAIAvailable()
        ) {

            return null;

        }


        if (
            extractionService
        ) {

            return extractionService;

        }


        const gemini =
            new GeminiClient();


        extractionService =
            new ServiceV2(
                gemini
            );


        return extractionService;

    }


    //==================================================
    // AI CAPABILITY STATUS
    //
    // Safe for frontend use.
    // Does NOT expose API keys.
    //==================================================

    router.get(
        "/ai-capability",
        (req, res) => {

            const enabled =
                isAIEnabled();

            const keyConfigured =
                hasGeminiKey();

            const available =
                enabled &&
                keyConfigured;


            return res.json({

                success:
                    true,

                aiEnabled:
                    enabled,

                aiAvailable:
                    available,

                mode:
                    available
                        ? "AI_ASSISTED_AVAILABLE"
                        : "MANUAL_ONLY",

                provider:
                    available
                        ? "Gemini"
                        : null

            });

        }
    );


    //==================================================
    // AI EXTRACTION
    //==================================================

    router.post(
        "/extract-v2",
        async (req, res) => {

            try {

                //==========================================
                // AI AVAILABILITY CHECK
                //==========================================

                if (
                    !isAIEnabled()
                ) {

                    return res
                        .status(503)
                        .json({

                            success:
                                false,

                            code:
                                "AI_DISABLED",

                            error:
                                "AI extraction is disabled. Use Manual Intelligence Mode."

                        });

                }


                if (
                    !hasGeminiKey()
                ) {

                    return res
                        .status(503)
                        .json({

                            success:
                                false,

                            code:
                                "AI_UNAVAILABLE",

                            error:
                                "AI extraction is unavailable. Use Manual Intelligence Mode."

                        });

                }


                //==========================================
                // EVIDENCE VALIDATION
                //==========================================

                const evidence =
                    req.body?.evidence ||
                    req.body?.text ||
                    "";


                if (
                    !String(evidence)
                        .trim()
                ) {

                    return res
                        .status(400)
                        .json({

                            success:
                                false,

                            code:
                                "EVIDENCE_REQUIRED",

                            error:
                                "Evidence is required."

                        });

                }


                //==========================================
                // LAZY SERVICE INITIALIZATION
                //==========================================

                const extraction =
                    getExtractionService();


                if (
                    !extraction
                ) {

                    return res
                        .status(503)
                        .json({

                            success:
                                false,

                            code:
                                "AI_UNAVAILABLE",

                            error:
                                "AI extraction is unavailable. Use Manual Intelligence Mode."

                        });

                }


                //==========================================
                // EXTRACTION
                //==========================================

                const result =
                    await extraction.extract(
                        String(evidence)
                    );


                return res.json({

                    success:
                        true,

                    mode:
                        "AI_ASSISTED",

                    intelligence:
                        result.intelligence

                });

            }

            catch (err) {

                console.error(
                    "[ExtractAPIV2]",
                    err?.message ||
                    "AI extraction failed."
                );


                return res
                    .status(500)
                    .json({

                        success:
                            false,

                        code:
                            "AI_EXTRACTION_FAILED",

                        error:
                            err?.message ||
                            "AI extraction failed."

                    });

            }

        }
    );


    return router;

};