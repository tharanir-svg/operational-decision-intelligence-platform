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
  if (step > unlockedUntil) return;

  currentStep = step;

  // Panes
  document.querySelectorAll('.step-pane').forEach((p, i) => {
    p.classList.toggle('active', i === step);
  });

  // Step buttons
  document.querySelectorAll('.step-btn').forEach((btn, i) => {
    btn.classList.remove('active','locked','done');
    if (i === step)          btn.classList.add('active');
    else if (i < step)       btn.classList.add('done');
    else if (i > unlockedUntil) btn.classList.add('locked');
  });

  // Connectors
  document.querySelectorAll('.step-connector').forEach((conn, i) => {
    conn.classList.remove('active','done');
    if (i < step)         conn.classList.add('done');
    else if (i === step - 1) conn.classList.add('active');
  });
}

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
  // Text fields
  $('ip-summary').value    = d.incidentSummary        || '';
  $('ip-event-type').value = d.eventType               || '';
  $('ip-location').value   = d.location                || '';
  $('ip-country').value    = d.country                 || '';
  $('ip-category').value   = d.recommendedCategory     || '';
  $('ip-reasoning').value  = d.reasoning               || '';

  // Number fields
  $('ip-fatalities').value = d.fatalities  ?? 0;
  $('ip-injuries').value   = d.injuries    ?? 0;
  $('ip-crowd').value      = d.crowdSize   ?? 0;
  $('ip-confidence').value = d.confidence  ?? 0;

  // Arrays → comma-separated strings for editable textareas
  $('ip-threats').value    = Array.isArray(d.threatIndicators)      ? d.threatIndicators.join(', ')      : (d.threatIndicators      || '');
  $('ip-weapons').value    = Array.isArray(d.weapons)               ? d.weapons.join(', ')               : (d.weapons               || '');
  $('ip-crit-infra').value = Array.isArray(d.criticalInfrastructure)? d.criticalInfrastructure.join(', '): (d.criticalInfrastructure || '');

  // Boolean vipMentioned → human-readable string
  $('ip-vips').value = d.vipMentioned
    ? 'VIPs identified — see source material for details'
    : 'None identified';

  // Selects
  setSelectValue('ip-region',    d.region              || '');
  setSelectValue('ip-domain',    d.domain              || '');
  setSelectValue('ip-infra',     d.infrastructureImpact|| 'None');
  setSelectValue('ip-threshold', d.suggestedThreshold  || 'MONITOR');

  // Visual updates
  updateConfidenceBar(d.confidence ?? 0);
  updateThresholdColor($('ip-threshold'));
}

function setSelectValue(id, value) {
  const el = $(id);
  for (const opt of el.options) {
    if (opt.value === value) { el.value = value; return; }
  }
}

/* ── Analyze Evidence → POST /api/extract ──────────────────── */
function initAnalyzeBtn() {
  $('analyzeBtn').addEventListener('click', async () => {
    const err    = $('evidenceError');
    const text   = $('ev-text').value.trim();
    const url    = $('ev-url').value.trim();

    err.classList.add('hidden');
    err.style.cssText = '';

    if (!text && !url && !attachedFiles.length && !$('ev-region').value && !$('ev-domain').value) {
      err.textContent = 'Provide at least one evidence source or context field before analyzing.';
      err.classList.remove('hidden');
      return;
    }

    const btn = $('analyzeBtn'), txt = $('analyzeBtnText'), spn = $('analyzeSpinner');
    btn.disabled = true; txt.classList.add('hidden'); spn.classList.remove('hidden');

    try {
      const payload = {
        text,
        url,
        images: attachedFiles
          .filter(f => f.type.startsWith('image/'))
          .map(f => ({ name: f.name, size: f.size, type: f.type })),
        videos: attachedFiles
          .filter(f => f.type.startsWith('video/'))
          .map(f => ({ name: f.name, size: f.size, type: f.type }))
      };

      const res  = await fetch('/api/extract', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error || 'Extraction failed.');

      populateIntelPanelFromAPI(data.result);
      unlockStep(1);
      goToStep(1);

    } catch (ex) {
      err.textContent = ex.message || 'Network error — extraction service unavailable.';
      err.classList.remove('hidden');
    } finally {
      btn.disabled = false; txt.classList.remove('hidden'); spn.classList.add('hidden');
    }
  });
}

/* ── Approve & Continue ────────────────────────────────────── */
function initApproveBtn() {
  $('approveBtn').addEventListener('click', () => {
    const domain    = $('ip-domain').value;
    const eventType = $('ip-event-type').value;
    const region    = $('ip-region').value;
    const fatalities = parseInt($('ip-fatalities').value, 10) || 0;
    const injuries   = parseInt($('ip-injuries').value, 10)  || 0;
    const infra      = $('ip-infra').value || 'None';

    // Populate Manual tab
    setSelectValue('domain', domain);
    buildEventOptions(domain, $('eventType'), eventType);

    setSelectValue('region', region);
    $('fatalities').value = fatalities;
    $('injuries').value   = injuries;

    document.querySelectorAll('input[name="infrastructure"]').forEach(r => {
      r.checked = r.value === infra;
    });

    // Show origin badge
    const badge = $('stepOriginBadge');
    badge.textContent = 'Pre-filled from AI extraction';
    badge.className   = 'step-origin-badge from-intel';

    $('formError').classList.add('hidden');

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

    await TaxonomyManager.load();

    DropdownManager.populateRegions();

    DropdownManager.populateDomains();

    initStepNav();

    bindDomainCascade(
        "ev-domain",
        "ev-eventType"
    );

    bindDomainCascade(
        "domain",
        "eventType"
    );

    $("ev-region").addEventListener(
        "change",
        e => {
            DropdownManager.populateCountries(
                e.target.value
            );
        }
    );

    initCharCount();

    initDropzone();

    initAnalyzeBtn();

    initApproveBtn();

    initConfidenceInput();

    initThresholdSelect();

    initNumButtons();

    $("eventForm").addEventListener(
        "submit",
        handleEvaluate
    );

    checkHealth();

    setInterval(checkHealth, 30000);

});