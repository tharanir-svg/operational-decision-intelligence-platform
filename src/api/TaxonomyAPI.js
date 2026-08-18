const express = require("express");
const TaxonomyService = require("../services/TaxonomyService");

module.exports = function () {

    const router = express.Router();

    const taxonomyService = new TaxonomyService();

    router.get("/taxonomy", (req, res) => {

        try {

            const taxonomy = taxonomyService.getTaxonomy();
            
            
            res.json({
                success: true,
                timestamp: new Date().toISOString(),
                taxonomy
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                error: error.message
            });

        }

    });

    return router;

};