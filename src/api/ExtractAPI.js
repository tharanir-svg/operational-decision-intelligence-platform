const express = require("express");
const AIExtractionService = require("../services/AIExtractionService");

module.exports = function () {

    const router = express.Router();

    const extractionService = new AIExtractionService();

    router.post("/extract", async (req, res) => {

        try {

            const result =
                await extractionService.extractEvidence(req.body);

            res.json({

                success: true,

                timestamp: new Date().toISOString(),

                result

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                error: error.message

            });

        }

    });

    return router;

};