'use strict';
const TaxonomyManager = {

    taxonomy: null,

    async load() {

        if (this.taxonomy)
            return this.taxonomy;

        this.taxonomy =
            await API.getTaxonomy();

        return this.taxonomy;

    },

    getRegions() {

        return this.taxonomy?.regions || [];

    },

    getDomains() {

        return this.taxonomy?.domains || [];

    },

    getCountries(region) {

        return (
            this.taxonomy?.countries?.[region]
            || []
        );

    },

    getEventTypes(domain) {

        return (
            this.taxonomy?.eventTypes?.[domain]
            || []
        );

    }

};
const DropdownManager = {

    populate(selectId, items, placeholder) {

        const select =
            document.getElementById(selectId);

        if (!select) return;

        select.innerHTML = "";

        select.add(
            new Option(
                placeholder,
                ""
            )
        );

        items.forEach(item => {

            const value =
                item.name || item;

            select.add(
                new Option(
                    value,
                    value
                )
            );

        });

        select.disabled =
            items.length === 0;

    },

    populateRegions() {

        const regions =
            TaxonomyManager.getRegions();

        [

            "ev-region",

            "ip-region",

            "region"

        ].forEach(id => {

            this.populate(
                id,
                regions,
                "— Select Region —"
            );

        });

    },

    populateDomains() {

        const domains =
            TaxonomyManager.getDomains();

        [

            "ev-domain",

            "ip-domain",

            "domain"

        ].forEach(id => {

            this.populate(
                id,
                domains,
                "— Select Domain —"
            );

        });

    },

    populateCountries(region) {

        const countries =
            TaxonomyManager.getCountries(region);

        this.populate(

            "ev-country",

            countries,

            "— Select Country —"

        );

    },

    populateEventTypes(domain, target) {

        const events =
            TaxonomyManager.getEventTypes(domain);

        this.populate(

            target,

            events,

            "— Select Event Type —"

        );

    }

};

/* ── Static data ───────────────────────────────────────────── */

const ACTION_INFO = {

    FLASH: {
        label:
            "FLASH — Immediate highest-priority escalation",
        cls:
            "action-flash",
        sev:
            "severity-flash",
        gauge:
            "gauge-flash"
    },

    GLOBAL: {
        label:
            "GLOBAL — Global operational escalation",
        cls:
            "action-flash",
        sev:
            "severity-flash",
        gauge:
            "gauge-flash"
    },

    GLOBAL_URGENT: {
        label:
            "GLOBAL URGENT — Global coordination required",
        cls:
            "action-escalate",
        sev:
            "severity-escalate",
        gauge:
            "gauge-escalate"
    },

    NATIONAL_URGENT: {
        label:
            "NATIONAL URGENT — National coordination required",
        cls:
            "action-watch",
        sev:
            "severity-watch",
        gauge:
            "gauge-watch"
    },

    LOCAL_URGENT: {
        label:
            "LOCAL URGENT — Local escalation required",
        cls:
            "action-local",
        sev:
            "severity-local",
        gauge:
            "gauge-local"
    },

    SIGNAL: {
        label:
            "SIGNAL — Monitor and validate",
        cls:
            "action-monitor",
        sev:
            "severity-monitor",
        gauge:
            "gauge-monitor"
    },

    MONITOR: {
        label:
            "MONITOR — Routine surveillance",
        cls:
            "action-monitor",
        sev:
            "severity-monitor",
        gauge:
            "gauge-monitor"
    },

    ESCALATE: {
        label:
            "ESCALATE — High priority response",
        cls:
            "action-escalate",
        sev:
            "severity-escalate",
        gauge:
            "gauge-escalate"
    },

    WATCH: {
        label:
            "WATCH — Active monitoring required",
        cls:
            "action-watch",
        sev:
            "severity-watch",
        gauge:
            "gauge-watch"
    }

};
//==================================================
// Policy Display Styling
//==================================================

const POLICY_STYLE = {

    FLASH: {
        bg:
            "var(--flash-bg, rgba(239, 68, 68, 0.12))",
        border:
            "var(--flash-border, #ef4444)",
        color:
            "var(--flash-text, #fca5a5)"
    },

    GLOBAL: {
        bg:
            "var(--flash-bg, rgba(239, 68, 68, 0.12))",
        border:
            "var(--flash-border, #ef4444)",
        color:
            "var(--flash-text, #fca5a5)"
    },

    GLOBAL_URGENT: {
        bg:
            "var(--escalate-bg, rgba(249, 115, 22, 0.12))",
        border:
            "var(--escalate-border, #f97316)",
        color:
            "var(--escalate-text, #fdba74)"
    },

    NATIONAL_URGENT: {
        bg:
            "var(--watch-bg, rgba(234, 179, 8, 0.12))",
        border:
            "var(--watch-border, #eab308)",
        color:
            "var(--watch-text, #fde047)"
    },

    LOCAL_URGENT: {
        bg:
            "var(--local-bg, rgba(59, 130, 246, 0.12))",
        border:
            "var(--local-border, #3b82f6)",
        color:
            "var(--local-text, #93c5fd)"
    },

    SIGNAL: {
        bg:
            "var(--monitor-bg, rgba(100, 116, 139, 0.12))",
        border:
            "var(--monitor-border, #64748b)",
        color:
            "var(--monitor-text, #cbd5e1)"
    },

    MONITOR: {
        bg:
            "var(--monitor-bg, rgba(100, 116, 139, 0.12))",
        border:
            "var(--monitor-border, #64748b)",
        color:
            "var(--monitor-text, #cbd5e1)"
    },

    ESCALATE: {
        bg:
            "var(--escalate-bg, rgba(249, 115, 22, 0.12))",
        border:
            "var(--escalate-border, #f97316)",
        color:
            "var(--escalate-text, #fdba74)"
    },

    WATCH: {
        bg:
            "var(--watch-bg, rgba(234, 179, 8, 0.12))",
        border:
            "var(--watch-border, #eab308)",
        color:
            "var(--watch-text, #fde047)"
    },

    MATCHED: {
        bg:
            "rgba(34, 197, 94, 0.10)",
        border:
            "#22c55e",
        color:
            "#86efac"
    }

};

const GAUGE_ARC  = 376.99;
const GAUGE_CIRC = 565.49;

/* ── Helpers ───────────────────────────────────────────────── */
/*
 * Shared helper functions are provided by helpers.js.
 *
 * Available globally:
 *   $
 *   qs
 *   qsa
 *   esc
 *   fmtBytes
 *   scoreGaugeClass
 *   scoreLabel
 *   formatNumber
 *   formatPercent
 *   joinArray
 */

/* ── Pipeline state ────────────────────────────────────────── */
let currentStep   = 0;
let unlockedUntil = 0; // highest step ever reached

function goToStep(step) {

    console.log("GO TO STEP:", step);

    if (step > unlockedUntil) {
        console.log("Blocked by unlockedUntil");
        return;
    }

    currentStep = step;

    const panes = document.querySelectorAll(".step-pane");

    console.log("Found panes:", panes.length);

    panes.forEach((pane, index) => {

        console.log(
            "Pane",
            index,
            pane.id,
            "before:",
            pane.className
        );

        pane.classList.remove("active");

        if (index === step) {
            pane.classList.add("active");
        }

        console.log(
            "Pane",
            index,
            "after:",
            pane.className
        );
    });

    document.querySelectorAll(".step-btn").forEach((btn, index) => {

        btn.classList.remove("active", "done", "locked");

        if (index === step)
            btn.classList.add("active");
        else if (index < step)
            btn.classList.add("done");
        else if (index > unlockedUntil)
            btn.classList.add("locked");

    });

    document.querySelectorAll(".step-connector").forEach((conn, index) => {

        conn.classList.remove("active", "done");

        if (index < step)
            conn.classList.add("done");
        else if (index === step - 1)
            conn.classList.add("active");

    });

}

  // Panes

function unlockStep(step) {
  if (step > unlockedUntil) {
    unlockedUntil = step;
    document.querySelectorAll('.step-btn').forEach((btn, i) => {
      if (i <= unlockedUntil) btn.classList.remove('locked');
    });
  }
}

function initStepNav() {
  document.querySelectorAll('.step-btn').forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (i <= unlockedUntil) goToStep(i);
    });
  });

  $('backToEvidence').addEventListener('click', () => goToStep(0));
  $('backToIntel').addEventListener('click',    () => goToStep(1));
}

/* ── Domain → Event Type cascade ──────────────────────────── */
function buildEventOptions(

    domain,

    selectEl,

    currentValue = ""

) {

    const events =
        TaxonomyManager.getEventTypes(domain);

    selectEl.innerHTML = "";

    selectEl.add(

        new Option(

            "— Select Event Type —",

            ""

        )

    );

    events.forEach(event => {

        const value =
            event.name || event;

        const option =
            new Option(

                value,

                value

            );

        if (value === currentValue)

            option.selected = true;

        selectEl.add(option);

    });

    selectEl.disabled =
        events.length === 0;

}
function bindDomainCascade(

    domainId,

    eventTypeId

) {

    $(domainId).addEventListener(

        "change",

        () => {

            buildEventOptions(

                $(domainId).value,

                $(eventTypeId)

            );

        }

    );

}
/* ── Character count ───────────────────────────────────────── */
function initCharCount() {
  $('ev-text').addEventListener('input', () => {
    const n = $('ev-text').value.length;
    $('charCount').textContent = n.toLocaleString() + ' character' + (n === 1 ? '' : 's');
  });
}

/* ── Drag & Drop ───────────────────────────────────────────── */
let attachedFiles = [];

function renderFileList() {
  const list = $('fileList');
  list.innerHTML = '';
  attachedFiles.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'file-item';
    const isImage = f.type.startsWith('image/');
    item.innerHTML = isImage
      ? `<img class="file-thumb" src="${URL.createObjectURL(f)}" alt="" />`
      : `<div class="file-thumb-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="8" height="12" rx="1.5" stroke="#4b5d7a" stroke-width="1.3"/><path d="M5 5h4M5 7.5h4M5 10h2" stroke="#4b5d7a" stroke-width="1.1" stroke-linecap="round"/></svg></div>`;
    item.innerHTML += `<div class="file-info"><div class="file-name">${esc(f.name)}</div><div class="file-size">${fmtBytes(f.size)}</div></div><button class="file-remove" data-idx="${i}" title="Remove">×</button>`;
    list.appendChild(item);
  });
  list.querySelectorAll('.file-remove').forEach(btn => {
    btn.addEventListener('click', () => { attachedFiles.splice(parseInt(btn.dataset.idx,10),1); renderFileList(); });
  });
}

function addFiles(files) {
  files.forEach(f => { if (!attachedFiles.find(x => x.name===f.name&&x.size===f.size)) attachedFiles.push(f); });
  renderFileList();
}

function initDropzone() {
  const zone = $('dropzone'), input = $('fileInput'), browse = $('dropzoneBrowse');
  browse.addEventListener('click', e => { e.stopPropagation(); input.click(); });
  zone.addEventListener('click',   () => input.click());
  input.addEventListener('change', () => { addFiles(Array.from(input.files)); input.value=''; });
  zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', e => { if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over'); });
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    addFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')||f.type.startsWith('video/')));
  });
}

/* ── Confidence bar ────────────────────────────────────────── */
function updateConfidenceBar(val) {
  const n    = Math.max(0, Math.min(100, parseInt(val, 10) || 0));
  const fill = $('confidenceFill');
  fill.style.width = n + '%';
  fill.className = 'confidence-fill ' + (n >= 75 ? 'high' : n >= 50 ? 'medium' : n >= 25 ? 'low' : 'vlow');
}

function initConfidenceInput() {
  $('ip-confidence').addEventListener('input', () => updateConfidenceBar($('ip-confidence').value));
}

/* ── Threshold select color ────────────────────────────────── */
function updateThresholdColor(selectEl) {
  const v = selectEl.value.toLowerCase().replace('_','-');
  selectEl.className = 'threshold-select ts-' + (v === 'local-urgent' ? 'local' : v);
}

function initThresholdSelect() {
  const sel = $('ip-threshold');
  sel.addEventListener('change', () => updateThresholdColor(sel));
}

/* ── Map /api/extract response → Intelligence Panel fields ─── */
function populateIntelPanelFromAPI(d) {

    console.log("================================");
    console.log("AUTO POPULATION ENGINE");
    console.log("================================");

    console.dir(d);

    window.currentExtraction = d;

    const auto = new AutoPopulationEngine(d);

    //------------------------------------------------
    // Summary
    //------------------------------------------------

    $("ip-summary").value =
        auto.value("summary") ||
        auto.value("incidentSummary");

    //------------------------------------------------
    // Classification
    //------------------------------------------------

    $("ip-event-type").value =
        auto.value("eventType");

    $("ip-location").value =
        auto.value("city") ||
        auto.value("location");

    $("ip-country").value =
        auto.value("country");

    $("ip-category").value =
        auto.value("suggestedCategory") ||
        auto.value("recommendedCategory");

    $("ip-reasoning").value =
        auto.value("reasoning");

    //------------------------------------------------
    // Numbers
    //------------------------------------------------

    $("ip-fatalities").value =
        auto.fatalities();

    $("ip-injuries").value =
        auto.injuries();

    $("ip-crowd").value =
        auto.value("crowdSize") || 0;

    $("ip-confidence").value =
        auto.confidence();

    //------------------------------------------------
    // Arrays
    //------------------------------------------------

    $("ip-threats").value =
        auto.list("threatIndicators").join(", ");

    $("ip-weapons").value =
        auto.list("weapons").join(", ");

    $("ip-crit-infra").value =
        auto.list("criticalInfrastructure").join(", ");

    //------------------------------------------------
    // VIP
    //------------------------------------------------

    $("ip-vips").value =
        auto.list("persons").join(", ");

    //------------------------------------------------
    // Dropdowns
    //------------------------------------------------

    setSelectValue(
        "ip-region",
        auto.value("region")
    );

    setSelectValue(
        "ip-domain",
        auto.value("domain")
    );

    setSelectValue(
        "ip-threshold",
        auto.value("suggestedThreshold") || "MONITOR"
    );

    setSelectValue(
        "ip-infra",
        auto.infrastructureImpact()
    );

    //------------------------------------------------
    // Visuals
    //------------------------------------------------

    updateConfidenceBar(
        auto.confidence()
    );

    updateThresholdColor(
        $("ip-threshold")
    );

    console.log("AUTO POPULATION COMPLETE");

}

function setSelectValue(id, value) {
  const el = $(id);
  for (const opt of el.options) {
    if (opt.value === value) { el.value = value; return; }
  }
}

/* ── Analyze Evidence → POST /api/extract ──────────────────── */
function initAnalyzeBtn() {

    const analyzeBtn = document.getElementById("analyzeBtn");

    if (!analyzeBtn) {
        console.error("Analyze button not found.");
        return;
    }

    analyzeBtn.addEventListener("click", async () => {

        console.log("Analyze button clicked");

        const err = document.getElementById("evidenceError");

        const region =
            document.getElementById("ev-region")?.value || "";

        const country =
            document.getElementById("ev-country")?.value || "";

        const domain =
            document.getElementById("ev-domain")?.value || "";

        const eventType =
            document.getElementById("ev-eventType")?.value || "";

        const text =
            document.getElementById("ev-text")?.value.trim() || "";

        const url =
            document.getElementById("ev-url")?.value.trim() || "";

        if (err) {

            err.classList.add("hidden");
            err.textContent = "";

        }

        if (
            !text &&
            !url &&
            !region &&
            !domain
        ) {

            if (err) {

                err.textContent =
                    "Please enter evidence or choose a context.";

                err.classList.remove("hidden");

            }

            return;

        }

        analyzeBtn.disabled = true;

        analyzeBtn.innerHTML =
            "Analyzing...";

try {

    const payload = {

        evidence: text,

        region,

        country,

        domain,

        eventType,

        url

    };

    console.log("Sending payload to V2");
    console.dir(payload);

    const response = await fetch("/api/extract-v2", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(payload)

    });

    const result = await response.json();

    console.log("========== V2 RESPONSE ==========");
    console.dir(result);

    if (!response.ok) {

        throw new Error(
            result.error || "Extraction failed."
        );

    }

    if (!result.success) {

        throw new Error(
            result.error || "Extraction unsuccessful."
        );

    }

    //------------------------------------------
    // Store Enterprise Object
    //------------------------------------------

    window.currentExtraction =
        result.intelligence;

    console.log("Enterprise Intelligence");
    console.dir(window.currentExtraction);

    //------------------------------------------
    // Populate Pane 2
    //------------------------------------------

    window.IntelligenceMapperV2.set(
    window.currentExtraction
);

    console.log("Current Extraction");
    console.dir(window.currentExtraction);

    console.log("Mapper After Set");
    console.dir(window.IntelligenceMapperV2.get());

    window.IntelligenceMapperV2.populatePane2();

    //------------------------------------------
    // Unlock Step 2
    //------------------------------------------

    unlockStep(1);

    goToStep(1);

}

        catch (e) {

            console.error(e);

            if (err) {

                err.textContent =

                    e.message;

                err.classList.remove("hidden");

            }

        }

        finally {

            analyzeBtn.disabled = false;

            analyzeBtn.innerHTML =
                "Analyze Evidence";

        }

    });

}
//==================================================
// Convert editable comma-separated intelligence
// fields back into arrays
//==================================================

function textToArray(value) {

    if (!value) {
        return [];
    }

    return String(value)
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

}


//==================================================
// Capture analyst-approved intelligence from Page 2
//==================================================

function syncApprovedIntelligenceFromPane2() {

    const current =
        window.IntelligenceMapperV2?.get?.();

    if (!current) {

        console.error(
            "No intelligence available to approve."
        );

        return null;

    }


    const approved = {

        ...current,


        //==========================================
        // Narrative
        //==========================================

        summary:
            $("ip-summary")?.value?.trim() ||
            current.summary ||
            "",


        //==========================================
        // Classification
        //==========================================

        eventType:
            $("ip-event-type")?.value?.trim() ||
            current.eventType ||
            "",

        domain:
            $("ip-domain")?.value ||
            current.domain ||
            "",

        region:
            $("ip-region")?.value ||
            current.region ||
            "",

        country:
            $("ip-country")?.value?.trim() ||
            current.country ||
            "",

        city:
            $("ip-location")?.value?.trim() ||
            current.city ||
            "",


        //==========================================
        // Confidence
        //==========================================

        confidence:
            Number(
                $("ip-confidence")?.value ??
                current.confidence ??
                0
            ),


        //==========================================
        // Casualties
        //==========================================

        casualties: {

            fatalities:
                Number(
                    $("ip-fatalities")?.value ??
                    current.casualties?.fatalities ??
                    0
                ),

            injuries:
                Number(
                    $("ip-injuries")?.value ??
                    current.casualties?.injuries ??
                    0
                )

        },


        //==========================================
        // Crowd
        //==========================================

        crowdSize:
            Number(
                $("ip-crowd")?.value ??
                current.crowdSize ??
                0
            ),


        //==========================================
        // Infrastructure
        //==========================================

        infrastructureImpact:
            $("ip-infra")?.value ||
            current.infrastructureImpact ||
            "None",

        criticalInfrastructure:
            textToArray(
                $("ip-crit-infra")?.value
            ),


        //==========================================
        // Intelligence Indicators
        //==========================================

        threatIndicators:
            textToArray(
                $("ip-threats")?.value
            ),

        weapons:
            textToArray(
                $("ip-weapons")?.value
            ),

        persons:
            textToArray(
                $("ip-vips")?.value
            ),


        //==========================================
        // AI Recommendation
        //==========================================

        suggestedCategory:
            $("ip-category")?.value?.trim() ||
            current.suggestedCategory ||
            "",

        suggestedThreshold:
            $("ip-threshold")?.value ||
            current.suggestedThreshold ||
            "MONITOR",

        reasoning:
            $("ip-reasoning")?.value?.trim() ||
            current.reasoning ||
            ""

    };


    //------------------------------------------
    // Re-store analyst-approved intelligence
    //------------------------------------------

    window.IntelligenceMapperV2.set(
        approved
    );


    window.currentExtraction =
        window.IntelligenceMapperV2.get();


    console.log(
        "===== APPROVED INTELLIGENCE ====="
    );

    console.dir(
        window.currentExtraction
    );


    return window.currentExtraction;

}

/* ── Approve & Continue ────────────────────────────────────── */

function initApproveBtn() {

    const approveBtn =
        $("approveBtn");


    if (!approveBtn) {

        console.error(
            "Approve button not found."
        );

        return;

    }


    approveBtn.addEventListener(
        "click",
        () => {


            //--------------------------------------
            // Ensure extraction exists
            //--------------------------------------

            if (
                !window.IntelligenceMapperV2
                    ?.hasData?.()
            ) {

                alert(
                    "No AI extraction available."
                );

                return;

            }


            //--------------------------------------
            // Capture analyst-approved Page 2
            //--------------------------------------

            const approved =
                syncApprovedIntelligenceFromPane2();


            if (!approved) {

                alert(
                    "Unable to prepare approved intelligence."
                );

                return;

            }


            //--------------------------------------
            // Populate Page 3 from SAME object
            //--------------------------------------

            window.IntelligenceMapperV2
                .populatePane3();


            //--------------------------------------
            // Clear previous form errors
            //--------------------------------------

            $("formError")
                ?.classList
                .add("hidden");


            //--------------------------------------
            // Unlock Page 3
            //--------------------------------------

            unlockStep(2);

            goToStep(2);

        }
    );

}

/* ── Manual evaluation ─────────────────────────────────────── */
function setLoading(on) {
  $('evaluateBtn').disabled = on;
  $('btnText').classList.toggle('hidden', on);
  $('btnSpinner').classList.toggle('hidden', !on);
}

function showFormError(msg) {
  const el = $('formError');
  el.textContent = msg;
  el.style.cssText = '';
  el.classList.remove('hidden');
}

async function handleEvaluate(e) {

    e.preventDefault();


    $("formError")
        ?.classList
        .add("hidden");


    //==============================================
    // Read Page 3 editable fields
    //==============================================

    const domain =
        $("domain")?.value || "";

    const eventType =
        $("eventType")?.value || "";

    const region =
        $("region")?.value || "";

    const fatalities =
        parseInt(
            $("fatalities")?.value,
            10
        ) || 0;

    const injuries =
        parseInt(
            $("injuries")?.value,
            10
        ) || 0;

    const infrastructureImpact =
        qs(
            'input[name="infrastructure"]:checked'
        )?.value || "None";


    //==============================================
    // Required fields
    //==============================================

    if (!domain) {

        return showFormError(
            "Please select a domain."
        );

    }


    if (!eventType) {

        return showFormError(
            "Please select an event type."
        );

    }


    if (!region) {

        return showFormError(
            "Please select a region."
        );

    }


    //==============================================
    // Export COMPLETE approved intelligence
    //==============================================

    const approvedIntelligence =
        window.IntelligenceMapperV2
            ?.toDecisionInput?.() || {};


    //==============================================
    // Page 3 values override approved values
    // because Page 3 remains analyst-editable
    //==============================================

    const payload = {

        ...approvedIntelligence,

        domain,

        eventType,

        region,

        fatalities,

        injuries,

        infrastructureImpact,


        //------------------------------------------
        // Preserve infrastructure evidence
        //------------------------------------------

        criticalInfrastructure:
            Array.isArray(
                approvedIntelligence
                    .criticalInfrastructure
            )
                ? approvedIntelligence
                    .criticalInfrastructure
                : []

    };


    console.log(
        "===== DECISION PAYLOAD ====="
    );

    console.dir(
        payload
    );


    setLoading(true);


    try {


        const response =
            await fetch(
                "/api/decision",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Evaluation failed."
            );

        }


        console.log(
            "===== DECISION RESULT ====="
        );

        console.dir(
            data.result
        );


        //------------------------------------------
        // Render result
        //------------------------------------------

        renderResults(
            data.result,
            payload
        );


        //------------------------------------------
        // Evaluation timestamp
        //------------------------------------------

        $("lastEvalTime").textContent =
            "Last evaluated: " +
            new Date()
                .toLocaleTimeString(
                    [],
                    {
                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        second:
                            "2-digit"
                    }
                );

    }

    catch (error) {


        console.error(
            "Decision evaluation failed:",
            error
        );


        showFormError(
            error.message ||
            "Network error."
        );

    }

    finally {

        setLoading(false);

    }

}

/* ── Results rendering ─────────────────────────────────────── */
function renderResults(result, payload) {

    //------------------------------------------
    // Show Results Area
    //------------------------------------------

    $("resultsPlaceholder")
        .classList
        .add("hidden");

    const content =
        $("resultsContent");

    content
        .classList
        .remove("hidden");

    void content.offsetWidth;


    //==================================================
    // Risk Score
    //==================================================

    const risk =
        result.riskScore || {};

    const score =
        typeof risk === "object"
            ? Number(
                risk.score ?? 0
            )
            : Number(
                risk || 0
            );


    //------------------------------------------
    // Gauge may visually represent only 0–100,
    // while actual operational score may exceed 100.
    //------------------------------------------

    const normalizedGaugeScore =
        typeof risk === "object"
            ? Number(
                risk.normalizedScore ??
                Math.min(
                    score,
                    100
                )
            )
            : Math.min(
                score,
                100
            );


    const gaugeScore =
        Math.max(
            0,
            Math.min(
                normalizedGaugeScore,
                100
            )
        );


    const fill =
        $("gaugeFill");


    fill.setAttribute(
        "stroke-dasharray",
        `${
            (gaugeScore / 100) *
            GAUGE_ARC
        } ${GAUGE_CIRC}`
    );


    fill.className.baseVal =
        "gauge-fill " +
        scoreGaugeClass(
            score
        );


    //------------------------------------------
    // Display RAW operational score
    //------------------------------------------

    $("gaugeScore").textContent =
        score;


    $("gaugeLabel").textContent =
        scoreLabel(
            score
        );


    //==================================================
    // Risk Factors
    //==================================================

    const factors =
        Array.isArray(
            result.riskScore?.factors
        )
            ? result.riskScore.factors
            : [];


    const riskFactorsElement =
        $("riskFactors");


    if (!factors.length) {

        riskFactorsElement.innerHTML =
            '<span class="muted">' +
            'No scoring factors returned.' +
            '</span>';

    }
    else {

        riskFactorsElement.innerHTML =
            factors
                .map(factor => {


                    const factorName =
                        factor.name ||
                        factor.factor ||
                        "Risk Factor";


                    const factorPoints =
                        factor.points ??
                        factor.score ??
                        factor.weight ??
                        0;


                    const factorReason =
                        factor.reason ||
                        "";


                    return `

                        <div class="factor-item">

                            <div>

                                <div class="factor-title">
                                    ${esc(factorName)}
                                </div>

                                ${
                                    factorReason
                                        ? `
                                            <div
                                                class="factor-reason"
                                                title="${esc(factorReason)}"
                                            >
                                                ${esc(factorReason)}
                                            </div>
                                          `
                                        : ""
                                }

                            </div>

                            <div class="factor-score">
                                +${esc(factorPoints)}
                            </div>

                        </div>

                    `;

                })
                .join("");

    }


    //==================================================
    // Threshold Decision
    //==================================================

    const threshold =
        result.thresholdDecision || {};


    const thresholdAction =
        threshold.action ||
        threshold.level ||
        "MONITOR";


    const thresholdInfo =
        ACTION_INFO[
            thresholdAction
        ] ||
        ACTION_INFO.MONITOR;


    //------------------------------------------
    // Main Threshold
    //------------------------------------------

    const thresholdActionElement =
        $("thresholdAction");


    thresholdActionElement.textContent =
        String(
            thresholdAction
        )
            .replace(
                /_/g,
                " "
            );


    thresholdActionElement.className =
        "threshold-action " +
        thresholdInfo.cls;


    //------------------------------------------
    // Severity
    //------------------------------------------

    const severityElement =
        $("thresholdSeverity");


    severityElement.textContent =
        `Severity ${
            threshold.severity ??
            "—"
        }`;


    severityElement.className =
        "meta-pill " +
        thresholdInfo.sev;


    //------------------------------------------
    // Threshold Source
    //------------------------------------------

    const sourceElement =
        $("thresholdSource");


    if (
        threshold.source ===
        "event-rule"
    ) {

        sourceElement.textContent =
            "Event Rule";

    }
    else if (
        threshold.source ===
        "score-band"
    ) {

        sourceElement.textContent =
            "Score Band";

    }
    else {

        sourceElement.textContent =
            threshold.source ||
            "Decision Engine";

    }


    sourceElement.className =
        "meta-pill";


    //------------------------------------------
    // Rule ID
    //------------------------------------------

    const ruleElement =
        $("thresholdRule");


    if (
        threshold.ruleId
    ) {

        ruleElement.textContent =
            threshold.ruleId;

        ruleElement.classList
            .remove(
                "hidden"
            );

    }
    else {

        ruleElement.classList
            .add(
                "hidden"
            );

    }


    //==================================================
    // Override / Final Operational Decision
    //==================================================

    const override =
        result.overrideDecision || {};


    let thresholdDescription =
        threshold.description ||
        thresholdInfo.label;


    if (
        override.overridden &&
        override.finalDecision
    ) {

        thresholdDescription +=
            " Final operational decision: " +
            String(
                override.finalDecision
            )
                .replace(
                    /_/g,
                    " "
                );


        if (
            override.overrideReason
        ) {

            thresholdDescription +=
                " — " +
                override.overrideReason;

        }


        thresholdDescription +=
            ".";

    }


    $("thresholdDesc").textContent =
        thresholdDescription;


    //==================================================
    // Decision Trace
    //==================================================

    const trace =
        Array.isArray(
            result.decisionTrace
        )
            ? result.decisionTrace
            : [];


    const traceElement =
        $("decisionTrace");


    if (!trace.length) {

        traceElement.innerHTML =
            '<div class="empty-state">' +
            'No decision trace available.' +
            '</div>';

    }
    else {

        traceElement.innerHTML =
            trace
                .map(
                    (
                        step,
                        index
                    ) => {


                        const engine =
                            step.engine ||
                            "Decision Engine";


                        const message =
                            step.decision ||
                            step.message ||
                            step.description ||
                            "";


                        return `

                            <div class="trace-card">

                                <div class="trace-number">
                                    ${index + 1}
                                </div>

                                <div class="trace-content">

                                    <div class="trace-engine">
                                        ${esc(engine)}
                                    </div>

                                    <div class="trace-message">
                                        ${esc(message)}
                                    </div>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");

    }


    //==================================================
    // Recommended Actions
    //==================================================

    const recommendationResult =
        result.recommendedActions;


    const actions =
        Array.isArray(
            recommendationResult
        )
            ? recommendationResult

            : Array.isArray(
                recommendationResult?.actions
            )
                ? recommendationResult.actions

                : [];


    const recommendationsElement =
        $("recommendedActionsList");


    if (!actions.length) {

        recommendationsElement.innerHTML =
            '<span class="muted">' +
            'No recommendations returned.' +
            '</span>';

    }
    else {

        recommendationsElement.innerHTML =
            actions
                .map(action => {


                    const actionText =
                        typeof action ===
                        "string"

                            ? action

                            : (
                                action.action ||
                                action.title ||
                                action.description ||
                                ""
                            );


                    return `

                        <div class="recommendation-item">
                            ${esc(actionText)}
                        </div>

                    `;

                })
                .join("");

    }


    //==================================================
    // Triggered Policies
    //==================================================

    const policies =
        Array.isArray(
            result.policies
        )
            ? result.policies
            : [];


    $("policyCount").textContent =
        policies.length;


    const policiesList =
        $("policiesList");


    policiesList.innerHTML =
        "";


    if (!policies.length) {

        policiesList.innerHTML =
            '<p style="' +
            'color:var(--text-muted);' +
            'font-size:13px">' +
            'No policies matched this event.' +
            '</p>';

    }
    else {

        policies.forEach(
            (
                policy,
                index
            ) => {


                const policyId =
                    policy.id ||
                    `POL-${index + 1}`;


                const policyName =
                    policy.name ||
                    `Operational Policy ${
                        index + 1
                    }`;


                const policyDescription =
                    policy.description ||

                    (
                        Array.isArray(
                            policy.reasons
                        )
                            ? policy.reasons
                                .join(
                                    " • "
                                )

                            : ""
                    ) ||

                    `Severity ${
                        policy.severity ??
                        "—"
                    }`;


                const decisionAction =
                    policy.decisionAction ||
                    policy.action ||
                    policy.level ||
                    (
                        policy.matched
                            ? "MATCHED"
                            : "MONITOR"
                    );


                const style =
                    POLICY_STYLE[
                        decisionAction
                    ] ||
                    POLICY_STYLE.MONITOR;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "policy-item";


                item.innerHTML = `

                    <span class="policy-id">
                        ${esc(policyId)}
                    </span>

                    <div class="policy-body">

                        <div class="policy-name">
                            ${esc(policyName)}
                        </div>

                        <div class="policy-desc">
                            ${esc(policyDescription)}
                        </div>

                    </div>

                    <span
                        class="policy-action"
                        style="
                            background:${style.bg};
                            border:1px solid ${style.border};
                            color:${style.color};
                        "
                    >
                        ${esc(decisionAction)}
                    </span>

                `;


                policiesList
                    .appendChild(
                        item
                    );

            }
        );

    }


    //==================================================
    // Original Input
    //==================================================

    $("originalInput").textContent =
        JSON.stringify(
            result.originalInput ||
            payload ||
            {},
            null,
            2
        );


    //==================================================
    // Normalized Input
    //==================================================

    $("normalizedInput").textContent =
        JSON.stringify(
            result.normalizedInput ||
            {},
            null,
            2
        );


    //==================================================
    // Operational Explanation
    //==================================================

    $("explanationSummary").textContent =
        result.explanation?.summary ||
        "—";


    const explanationInputs =
        $("explanationInputs");


    explanationInputs.innerHTML =
        "";


    const normalized =
        result.normalizedInput ||
        payload ||
        {};


    const explanationFields = {

        "Event Type":
            normalized.eventType,

        "Region":
            normalized.region,

        "Domain":
            normalized.domain,

        "Fatalities":
            normalized.fatalities,

        "Injuries":
            normalized.injuries,

        "Infrastructure Impact":
            normalized.infrastructureImpact,

        "Critical Infrastructure":
            Array.isArray(
                normalized
                    .criticalInfrastructure
            )
                ? normalized
                    .criticalInfrastructure
                    .join(", ")

                : normalized
                    .criticalInfrastructure

    };


    Object.entries(
        explanationFields
    )
        .forEach(
            (
                [
                    key,
                    value
                ]
            ) => {


                if (
                    value ===
                    undefined ||
                    value ===
                    null ||
                    value ===
                    ""
                ) {

                    return;

                }


                const chip =
                    document.createElement(
                        "div"
                    );


                chip.className =
                    "input-chip";


                chip.innerHTML = `

                    <span class="chip-key">
                        ${esc(key)}
                    </span>

                    <span class="chip-val">
                        ${esc(String(value))}
                    </span>

                `;


                explanationInputs
                    .appendChild(
                        chip
                    );

            }
        );

}

/* ── Number steppers ───────────────────────────────────────── */
function initNumButtons() {
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = $(btn.dataset.target);
      el.value = Math.max(0, (parseInt(el.value,10)||0) + parseInt(btn.dataset.delta,10));
    });
  });
}

/* ── Health check ──────────────────────────────────────────── */
async function checkHealth() {
  try {
    const r = await fetch('/api/health');
    if (r.ok) {
      $('statusDot').className    = 'status-dot online';
      $('statusLabel').textContent = 'Engine Online';
    } else throw new Error();
  } catch {
    $('statusDot').className    = 'status-dot offline';
    $('statusLabel').textContent = 'Engine Offline';
  }
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", async () => {

    console.log("1. DOM Loaded");

    await TaxonomyManager.load();
    console.log("2. Taxonomy Loaded");

    DropdownManager.populateRegions();
    console.log("3. Regions");

    DropdownManager.populateDomains();
    console.log("4. Domains");

    initStepNav();
    console.log("5. Step Nav");

    bindDomainCascade("ev-domain", "ev-eventType");
    console.log("6. Cascade 1");

    bindDomainCascade("domain", "eventType");
    console.log("7. Cascade 2");

    document.getElementById("ev-region")?.addEventListener(
        "change",
        e => DropdownManager.populateCountries(e.target.value)
    );
    console.log("8. Region Change");

    initCharCount();
    console.log("9. Char Count");

    initDropzone();
    console.log("10. Dropzone");

    initAnalyzeBtn();
    console.log("11. Analyze Button");

    initApproveBtn();
    console.log("12. Approve");

    initConfidenceInput();
    console.log("13. Confidence");

    initThresholdSelect();
    console.log("14. Threshold");

    initNumButtons();
    console.log("15. Numbers");

    document.getElementById("eventForm")?.addEventListener(
        "submit",
        handleEvaluate
    );
    console.log("16. Event Form");

    checkHealth();
    console.log("17. Health");

    setInterval(checkHealth, 30000);

    console.log("INITIALIZATION COMPLETE");

});