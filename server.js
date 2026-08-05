const createExtractAPIV2 =
    require("./src/api/ExtractAPIV2");

const express = require("express");
const path = require("path");

const DecisionOrchestrator = require("./src/core/DecisionOrchestrator");

const createDecisionAPI = require("./src/api/DecisionAPI");
const createExtractAPI = require("./src/api/ExtractAPI");
const createTaxonomyAPI = require("./src/api/TaxonomyAPI");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// ==========================================================
// Core Platform
// ==========================================================

const orchestrator = new DecisionOrchestrator();

// ==========================================================
// API Registration
// ==========================================================

console.log("Registering Decision API");
app.use("/api", createDecisionAPI(orchestrator));

console.log("Registering Extract API");
app.use("/api", createExtractAPI());

console.log("Registering Taxonomy API");
app.use("/api", createTaxonomyAPI());

console.log("Registering Extract API V2");

app.use("/api", createExtractAPIV2());

// ==========================================================
// Health Check
// ==========================================================

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        status: "Healthy",

        platform: "Operational Decision Intelligence Platform",

        version: "2.0.0",

        pid: process.pid,

        cwd: process.cwd(),

        node: process.version,

        serverTime: new Date().toISOString(),

        random: Math.random()

    });

});

// ==========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("========================================");
    console.log("🚀 ODIP SERVER STARTED");
    console.log("========================================");
    console.log("Platform : Operational Decision Intelligence Platform");
    console.log("Version  : 2.0.0");
    console.log("PID      :", process.pid);
    console.log("PORT     :", PORT);
    console.log("TIME     :", new Date().toISOString());
    console.log("NODE     :", process.version);
    console.log("========================================");
    console.log("");

});