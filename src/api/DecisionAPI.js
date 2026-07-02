const express = require("express");

module.exports = function(orchestrator) {

  const router = express.Router();

  router.get("/health", (req, res) => {
    res.json({
      status: "Healthy",
      platform: "Operational Decision Intelligence Platform",
      version: "1.0.0"
    });
  });

  router.post("/decision", (req, res) => {
    try {
      const result = orchestrator.evaluate(req.body);
      res.json({ success: true, timestamp: new Date().toISOString(), result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
