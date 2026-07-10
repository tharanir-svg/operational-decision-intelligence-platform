/*
 * ==========================================================
 * ODIP Frontend Helper Library
 * Sprint 2C
 * ==========================================================
 */

function $(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

function esc(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function fmtBytes(bytes) {

    if (!bytes || bytes <= 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];

    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {

        bytes /= 1024;
        i++;

    }

    return bytes.toFixed(1) + " " + units[i];

}

function scoreLabel(score) {

    if (score >= 90) return "Critical";

    if (score >= 75) return "High";

    if (score >= 50) return "Medium";

    if (score >= 25) return "Low";

    return "Minimal";

}

function scoreGaugeClass(score) {

    if (score >= 90) return "critical";

    if (score >= 75) return "high";

    if (score >= 50) return "medium";

    if (score >= 25) return "low";

    return "minimal";

}

function formatNumber(value) {

    if (value === null || value === undefined) return "-";

    return Number(value).toLocaleString();

}

function formatPercent(value) {

    if (value === null || value === undefined) return "-";

    return value + "%";

}

function joinArray(arr) {

    if (!Array.isArray(arr)) return "";

    return arr.join(", ");

}

console.log("✓ helpers.js loaded");