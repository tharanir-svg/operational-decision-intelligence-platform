const express = require("express");

const GeminiClient = require("../ai/GeminiClient");
const ServiceV2 = require("../extraction/ServiceV2");

module.exports = function createExtractAPIV2() {

    const router = express.Router();

    const gemini = new GeminiClient();

    const extraction = new ServiceV2(gemini);

    router.post("/extract-v2", async (req, res) => {

        try {

            const evidence =
                req.body.evidence ||
                req.body.text ||
                "";

            if (!evidence.trim()) {

                return res.status(400).json({

                    success: false,

                    error: "Evidence is required."

                });

            }

            console.log("");
            console.log("================================");
            console.log("EXTRACT API V2");
            console.log("================================");

            const result =
                await extraction.extract(evidence);

            return res.json({

                success: true,

                intelligence: result.intelligence

            });

        }

        catch (err) {

            console.error(err);

            return res.status(500).json({

                success: false,

                error: err.message

            });

        }

    });

    return router;

};