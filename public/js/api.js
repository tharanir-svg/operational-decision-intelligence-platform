/*
==========================================================
ODIP API Module
Sprint 5A
==========================================================
*/

const API = {

    taxonomy: null,

    async extract(payload) {

        const response = await fetch("/api/extract", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const data = await response.json();

        if (!response.ok)
            throw new Error(data.error || "Extraction failed.");

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

        if (!response.ok)
            throw new Error(data.error || "Decision evaluation failed.");

        return data;

    },

    async getTaxonomy(forceRefresh = false) {

        if (this.taxonomy && !forceRefresh)
            return this.taxonomy;

        const response =
            await fetch("/api/taxonomy");

        const data =
            await response.json();

        if (!response.ok)
            throw new Error(
                data.error || "Unable to load taxonomy."
            );

        this.taxonomy = data.taxonomy;

        return this.taxonomy;

    },

    async health() {

        const response =
            await fetch("/");

        return response.ok;

    }

};

console.log("✓ api.js loaded");