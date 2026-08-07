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
  FLASH:        { label: 'FLASH — Immediate Global Escalation',  cls: 'action-flash',    sev: 'severity-flash',    gauge: 'gauge-flash'    },
  ESCALATE:     { label: 'ESCALATE — High Priority Response',    cls: 'action-escalate', sev: 'severity-escalate', gauge: 'gauge-escalate' },
  WATCH:        { label: 'WATCH — Active Monitoring Required',   cls: 'action-watch',    sev: 'severity-watch',    gauge: 'gauge-watch'    },
  LOCAL_URGENT: { label: 'LOCAL URGENT — Regional Alert',        cls: 'action-local',    sev: 'severity-local',    gauge: 'gauge-local'    },
  MONITOR:      { label: 'MONITOR — Routine Surveillance',       cls: 'action-monitor',  sev: 'severity-monitor',  gauge: 'gauge-monitor'  }
};

const POLICY_STYLE = {
  FLASH:        { bg: 'var(--flash-bg)',    border: 'var(--flash-border)',    color: 'var(--flash-text)'    },
  ESCALATE:     { bg: 'var(--escalate-bg)', border: 'var(--escalate-border)', color: 'var(--escalate-text)' },
  WATCH:        { bg: 'var(--watch-bg)',    border: 'var(--watch-border)',    color: 'var(--watch-text)'    },
  LOCAL_URGENT: { bg: 'var(--local-bg)',    border: 'var(--local-border)',    color: 'var(--local-text)'    },
  MONITOR:      { bg: 'var(--monitor-bg)',  border: 'var(--monitor-border)',  color: 'var(--monitor-text)'  }
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

/* ── Approve & Continue ────────────────────────────────────── */
/* ── Approve & Continue ────────────────────────────────────── */
function initApproveBtn() {

    $("approveBtn").addEventListener("click", () => {

        if (!window.IntelligenceMapperV2.hasData()) {

            alert("No AI extraction available.");

            return;

        }

        //----------------------------------------------------
        // Populate Decision Workspace
        //----------------------------------------------------

        window.IntelligenceMapperV2.populatePane3();

        //----------------------------------------------------
        // Unlock Decision Step
        //----------------------------------------------------

        $("formError").classList.add("hidden");

        unlockStep(2);

        goToStep(2);

    });

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
  $('formError').classList.add('hidden');

  const domain     = $('domain').value;
  const eventType  = $('eventType').value;
  const region     = $('region').value;
  const fatalities = parseInt($('fatalities').value, 10) || 0;
  const injuries   = parseInt($('injuries').value, 10)   || 0;
  const infra      = qs('input[name="infrastructure"]:checked')?.value || 'None';

  if (!domain)    return showFormError('Please select a domain.');
  if (!eventType) return showFormError('Please select an event type.');
  if (!region)    return showFormError('Please select a region.');

  const payload = { eventType, region, domain, fatalities, injuries, infrastructureImpact: infra };
  setLoading(true);

  try {
    const res  = await fetch('/api/decision', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Evaluation failed.');
    renderResults(data.result, payload);
    $('lastEvalTime').textContent = 'Last evaluated: ' + new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  } catch (err) {
    showFormError(err.message || 'Network error.');
  } finally {
    setLoading(false);
  }
}

/* ── Results rendering ─────────────────────────────────────── */
function renderResults(result, payload) {
  $('resultsPlaceholder').classList.add('hidden');
  const c = $('resultsContent');
  c.classList.remove('hidden');
  void c.offsetWidth;

  // Gauge
const fill = $('gaugeFill');

const risk =
    result.riskScore || {};

const score =
    typeof risk === "object"
        ? Number(risk.score || 0)
        : Number(risk || 0);

fill.setAttribute(
    "stroke-dasharray",
    `${(score / 100) * GAUGE_ARC} ${GAUGE_CIRC}`
);

fill.className.baseVal =
    "gauge-fill " +
    scoreGaugeClass(score);

$('gaugeScore').textContent =
    score;

$('gaugeLabel').textContent =
    scoreLabel(score);
// --------------------------------------------------
// Risk Factors
// --------------------------------------------------

const factors =
    result.riskScore?.factors || [];

const rf =
    $('riskFactors');

if (!factors.length) {

    rf.innerHTML =
        '<span class="muted">No scoring factors returned.</span>';

} else {

    rf.innerHTML =
        factors.map(f => `
            <div class="factor-item">
                <div class="factor-title">${esc(f.name || f.factor || "Factor")}</div>
                <div class="factor-score">
                    +${f.score ?? f.weight ?? 0}
                </div>
            </div>
        `).join('');

}
// --------------------------------------------------
// Decision Trace
// --------------------------------------------------

const trace = result.decisionTrace || [];
const traceDiv = $('decisionTrace');

if (!trace.length) {

    traceDiv.innerHTML =
        '<div class="empty-state">No decision trace available.</div>';

} else {

    traceDiv.innerHTML = trace.map((step, index) => {

        const engine =
            step.engine || "Decision Engine";

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

    }).join("");

}
// --------------------------------------------------
// Recommended Actions
// --------------------------------------------------

const actions =
    result.recommendedActions || [];

const act =
    $('recommendedActionsList');

if (!actions.length) {

    act.innerHTML =
        '<span class="muted">No recommendations returned.</span>';

} else {

    act.innerHTML =
        actions.map(a => `
            <div class="recommendation-item">
                ${esc(
                    a.action ||
                    a.title ||
                    String(a)
                )}
            </div>
        `).join('');

}
  // Threshold
  const td     = result.thresholdDecision;
  const action = td.action || 'MONITOR';
  const info   = ACTION_INFO[action] || ACTION_INFO.MONITOR;
  const taEl   = $('thresholdAction');
  taEl.textContent = action.replace('_',' ');
  taEl.className   = 'threshold-action ' + info.cls;
  const sevEl  = $('thresholdSeverity');
  sevEl.textContent = `Severity ${td.severity ?? '—'}`;
  sevEl.className   = 'meta-pill ' + info.sev;
  const srcEl  = $('thresholdSource');
  srcEl.textContent = td.source === 'event-rule' ? 'Event Rule' : 'Score Band';
  srcEl.className   = 'meta-pill';
  const ruleEl = $('thresholdRule');
  if (td.ruleId) { ruleEl.textContent = td.ruleId; ruleEl.className = 'meta-pill'; ruleEl.classList.remove('hidden'); }
  else ruleEl.classList.add('hidden');
  $('thresholdDesc').textContent = info.label;

  // Policies
  const policies = result.policies || [];
  $('policyCount').textContent = policies.length;
  const list = $('policiesList');
  list.innerHTML = '';
  if (!policies.length) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No policies matched this event.</p>';
  } else {
    policies.forEach(p => {
      const st = POLICY_STYLE[p.decisionAction] || POLICY_STYLE.MONITOR;
      const item = document.createElement('div');
      item.className = 'policy-item';
      item.innerHTML = `<span class="policy-id">${esc(p.id)}</span><div class="policy-body"><div class="policy-name">${esc(p.name)}</div><div class="policy-desc">${esc(p.description||'')}</div></div><span class="policy-action" style="background:${st.bg};border:1px solid ${st.border};color:${st.color}">${esc(p.decisionAction)}</span>`;
      list.appendChild(item);
    });
  }

  // Explanation
  $('explanationSummary').textContent = result.explanation?.summary || '—';
  const ec = $('explanationInputs');
  ec.innerHTML = '';
  const fields = {'Event Type':payload.eventType,'Region':payload.region,'Domain':payload.domain,'Fatalities':payload.fatalities,'Injuries':payload.injuries,'Infrastructure':payload.infrastructureImpact};
  Object.entries(fields).forEach(([k,v]) => {
    if (v===undefined||v===null||v==='') return;
    const ch = document.createElement('div');
    ch.className = 'input-chip';
    ch.innerHTML = `<span class="chip-key">${esc(k)}</span><span class="chip-val">${esc(String(v))}</span>`;
    ec.appendChild(ch);
  });
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