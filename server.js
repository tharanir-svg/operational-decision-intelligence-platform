const express = require("express");

const DecisionOrchestrator =
  require("./src/core/DecisionOrchestrator");

const createDecisionAPI =
  require("./src/api/DecisionAPI");

const app = express();

app.use(express.json());

const orchestrator =
  new DecisionOrchestrator();

app.use(
  "/api",
  createDecisionAPI(orchestrator)
);

app.get("/", (req, res) => {

  res.json({
    platform:
      "Operational Decision Intelligence Platform",
    version: "1.0.0",
    status: "Running"
  });

});

const PORT = 3000;

app.listen(PORT, () => {

  console.log(
    `ODIP listening on port ${PORT}`
  );

});
