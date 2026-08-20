import {
    httpServerHandler
} from "cloudflare:node";

import express from "express";

import DecisionOrchestrator
    from "./src/core/DecisionOrchestrator.js";

import createDecisionAPI
    from "./src/api/DecisionAPI.js";

import createExtractAPI
    from "./src/api/ExtractAPI.js";

import createTaxonomyAPI
    from "./src/api/TaxonomyAPI.js";

import createExtractAPIV2
    from "./src/api/ExtractAPIV2.js";


//==================================================
// ODIP — CLOUDFLARE WORKER ENTRY
//==================================================

const app =
    express();


app.use(
    express.json()
);


//==================================================
// DECISION PLATFORM
//==================================================

const orchestrator =
    new DecisionOrchestrator();


//==================================================
// API ROUTES
//==================================================

app.use(
    "/api",
    createDecisionAPI(
        orchestrator
    )
);


app.use(
    "/api",
    createExtractAPI()
);


app.use(
    "/api",
    createTaxonomyAPI()
);


app.use(
    "/api",
    createExtractAPIV2()
);


//==================================================
// HEALTH
//==================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            status: "Healthy",

            platform:
                "Operational Decision Intelligence Platform",

            version:
                "2.0.0",

            runtime:
                "Cloudflare Workers"

        });

    }
);


//==================================================
// CLOUDFLARE NODE HTTP BRIDGE
//==================================================

const PORT =
    3000;


app.listen(
    PORT
);


export default
    httpServerHandler({
        port: PORT
    });
