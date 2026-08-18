const createExtractAPIV2 =
    require("./src/api/ExtractAPIV2");

const express =
    require("express");

const path =
    require("path");

const DecisionOrchestrator =
    require("./src/core/DecisionOrchestrator");

const createDecisionAPI =
    require("./src/api/DecisionAPI");

const createExtractAPI =
    require("./src/api/ExtractAPI");

const createTaxonomyAPI =
    require("./src/api/TaxonomyAPI");


const app =
    express();


//==================================================
// CORE MIDDLEWARE
//==================================================

app.use(
    express.json()
);


app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);


//==================================================
// CORE PLATFORM
//==================================================

const orchestrator =
    new DecisionOrchestrator();


//==================================================
// API REGISTRATION
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
// HEALTH CHECK
//
// Deliberately exposes only non-sensitive
// operational information.
//==================================================

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success:
                true,

            status:
                "Healthy",

            platform:
                "Operational Decision Intelligence Platform",

            version:
                "2.0.0"

        });

    }
);


//==================================================
// SERVER
//==================================================

const PORT =
    process.env.PORT ||
    5000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");
        console.log("========================================");
        console.log("ODIP SERVER STARTED");
        console.log("========================================");
        console.log(
            "Platform : Operational Decision Intelligence Platform"
        );
        console.log(
            "Version  : 2.0.0"
        );
        console.log(
            "Port     :",
            PORT
        );
        console.log("========================================");
        console.log("");

    }
);