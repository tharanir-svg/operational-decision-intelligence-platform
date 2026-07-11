/*
==========================================================
ODIP API Module
Sprint 2C
==========================================================
*/

const API = {

    async extract(payload) {

        const response = await fetch("/api/extract", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error || "Extraction failed.");

        }

        return data;

    },

    async evaluate(payload) {

        const response = await fetch("/api/decision", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.error || "Decision evaluation failed.");

        }

        return data;

    },

    async health() {

        const response = await fetch("/");

        return response.ok;

    }

};

console.log("✓ api.js loaded");