const express = require("express");

module.exports = function(orchestrator) {

  const router = express.Router();

  router.post("/decision", (req, res) => {

    try {

      const result = orchestrator.evaluate(req.body);

      res.json(result);

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }

  });

  return router;
};
