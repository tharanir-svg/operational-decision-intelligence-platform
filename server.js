const express = require("express");
const path = require("path");

const DecisionOrchestrator = require("./src/core/DecisionOrchestrator");
const createDecisionAPI = require("./src/api/DecisionAPI");
const createExtractAPI = require("./src/api/ExtractAPI");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const orchestrator = new DecisionOrchestrator();
console.log("Registering Decision API");
console.log("Registering Extract API");
app.use("/api", createDecisionAPI(orchestrator));
app.use("/api", createExtractAPI());

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
| This tells us exactly which server instance is answering requests.
*/
app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        status: "Healthy",

        platform: "Operational Decision Intelligence Platform",

        version: "1.0.0",

        pid: process.pid,

        cwd: process.cwd(),

        node: process.version,

        serverTime: new Date().toISOString(),

        random: Math.random()

    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("========================================");
    console.log("🚀 ODIP SERVER STARTED");
    console.log("========================================");
    console.log("PID      :", process.pid);
    console.log("PORT     :", PORT);
    console.log("TIME     :", new Date().toISOString());
    console.log("NODE     :", process.version);
    console.log("========================================");
    console.log("");

});