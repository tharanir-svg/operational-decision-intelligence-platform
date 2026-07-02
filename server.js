const express = require("express");
const path    = require("path");

const DecisionOrchestrator = require("./src/core/DecisionOrchestrator");
const createDecisionAPI    = require("./src/api/DecisionAPI");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const orchestrator = new DecisionOrchestrator();

app.use("/api", createDecisionAPI(orchestrator));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ODIP listening on port ${PORT}`);
});
