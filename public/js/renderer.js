/*
==========================================================
ODIP Renderer Module
Sprint 2C
==========================================================
*/

const Renderer = {

    renderExtraction(data) {

        console.log("Rendering extraction...");

        if (!data) return;

        console.table(data);

    },

    renderDecision(data) {

        console.log("Rendering decision...");

        if (!data) return;

        console.table(data);

    },

    showLoading(message = "Loading...") {

        console.log(message);

    },

    hideLoading() {

        console.log("Loading complete");

    },

    showError(error) {

        console.error(error);

    }

};

console.log("✓ renderer.js loaded");