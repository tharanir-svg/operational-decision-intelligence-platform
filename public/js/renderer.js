/*
==========================================================
ODIP Renderer Module
Sprint 3A - Part 1
==========================================================
*/

const Renderer = {

    renderExtraction(data) {
        console.log("Rendering extraction...");
        if (!data) return;
        console.table(data);
    },

    renderDecision(result) {

        if (!result) return;

        this.showResults();

        this.renderRiskGauge(result.riskScore);

        this.renderThreshold(result.thresholdDecision);

    },

    renderRiskGauge(riskScore) {

        const score =
            typeof riskScore === "object"
                ? Number(riskScore.score || 0)
                : Number(riskScore || 0);

        const scoreEl = document.getElementById("gaugeScore");
        const labelEl = document.getElementById("gaugeLabel");
        const fillEl  = document.getElementById("gaugeFill");

        if (scoreEl)
            scoreEl.textContent = score;

        const label = this.getRiskLabel(score);

        if (labelEl)
            labelEl.textContent = label;

        if (fillEl) {

            const circumference = 565.49;
            const pct = Math.max(0, Math.min(score,100))/100;

            fillEl.setAttribute(
                "stroke-dasharray",
                `${circumference*pct} ${circumference}`
            );

        }

    },

    renderThreshold(threshold) {

        if(!threshold) return;

        const action =
            document.getElementById("thresholdAction");

        const severity =
            document.getElementById("thresholdSeverity");

        const source =
            document.getElementById("thresholdSource");

        const rule =
            document.getElementById("thresholdRule");

        const desc =
            document.getElementById("thresholdDesc");

        if(action)
            action.textContent =
                threshold.level ||
                threshold.action ||
                "—";

        if(severity)
            severity.textContent =
                "Severity " +
                (threshold.severity ?? "-");

        if(source)
            source.textContent =
                threshold.source ||
                "Decision Engine";

        if(rule){

            if(threshold.rule){

                rule.classList.remove("hidden");
                rule.textContent = threshold.rule;

            }else{

                rule.classList.add("hidden");

            }

        }

        if(desc)
            desc.textContent =
                threshold.reason ||
                threshold.description ||
                "";

    },

    getRiskLabel(score){

        if(score >= 80) return "Critical";
        if(score >= 60) return "High";
        if(score >= 40) return "Medium";
        if(score >= 20) return "Low";

        return "Minimal";

    },

    showResults(){

        document
            .getElementById("resultsPlaceholder")
            ?.classList.add("hidden");

        document
            .getElementById("resultsContent")
            ?.classList.remove("hidden");

    },

    showLoading(message="Loading..."){
        console.log(message);
    },

    hideLoading(){
        console.log("Loading complete");
    },

    showError(error){
        console.error(error);
    }

};

console.log("✓ renderer.js loaded");