'use strict';

/* ── Static data ───────────────────────────────────────────── */
const EVENT_MAP = {
  Terrorism: ['Bomb Threat','Explosion','Active Shooter','Hostage Situation','Vehicle Attack','Chemical Attack','Biological Attack','Radiological Incident','IED Discovery','Suspicious Package'],
  Conflict:  ['Military Strike','Border Clash','Drone Strike','Missile Launch','Naval Incident','Airspace Violation','Mobilization','Ceasefire Violation'],
  Crime:     ['Robbery','Kidnapping','Homicide','Assault','Burglary','Arson'],
  Politics:  ['Election','Protest','Demonstration','Government Resignation','Parliament Vote','Executive Order'],
  Cyber:     ['Data Breach','Ransomware','DDoS Attack','Website Defacement','Credential Theft'],
  Weather:   ['Flood','Earthquake','Hurricane','Wildfire','Tornado','Heatwave','Snowstorm']
};

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

/* ── Mock extraction payload ───────────────────────────────── */
const MOCK_EXTRACTION = {
  summary:        'Coordinated bomb blast reported near the central market district in Karachi, Pakistan. A vehicle-borne IED detonated during morning rush hour, targeting a densely populated civilian area. Pakistani emergency services confirmed multiple fatalities and dozens of injuries on the scene. Security forces have cordoned the area and a secondary device was reportedly discovered nearby, indicating a multi-phase operation.',
  eventType:      'Explosion',
  location:       'Central Market District, Karachi',
  country:        'Pakistan',
  region:         'South Asia',
  domain:         'Terrorism',
  confidence:     87,
  fatalities:     12,
  injuries:       47,
  infrastructure: 'Moderate',
  crowdSize:      300,
  threats:        'Vehicle-borne IED, Coordinated attack, Civilian targeting, Rush hour timing, Secondary device reported',
  weapons:        'IED, Vehicle bomb, Explosive device',
  criticalInfra:  'Transport corridor, Central market district, Communication nodes',
  vips:           'None identified at this time',
  category:       'Terrorist Attack',
  threshold:      'FLASH',
  reasoning:      'The incident exhibits hallmarks of a coordinated terrorist attack: deliberate timing during peak civilian activity, deployment of a vehicle-borne IED, and targeting of a densely populated commercial zone. Confirmed fatality count (12) surpasses the THR-001 mass-casualty threshold. The South Asia regional baseline risk multiplier further elevates the aggregate risk score. Pattern analysis indicates possible affiliation with regional threat actors known to operate in Sindh province. Secondary device discovery suggests operational complexity consistent with a multi-phase attack. Recommendation: immediate FLASH escalation and activation of continuity protocols.'
};

const GAUGE_ARC  = 376.99;
const GAUGE_CIRC = 565.49;

/* ── Helpers ───────────────────────────────────────────────── */
const $  = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtBytes(n) {
  return n < 1024 ? `${n} B` : n < 1048576 ? `${(n/1024).toFixed(1)} KB` : `${(n/1048576).toFixed(1)} MB`;
}
function scoreGaugeClass(s) { return s >= 75 ? 'gauge-flash' : s >= 50 ? 'gauge-escalate' : s >= 25 ? 'gauge-watch' : 'gauge-monitor'; }
function scoreLabel(s)      { return s >= 75 ? 'Critical' : s >= 50 ? 'High' : s >= 25 ? 'Moderate' : 'Low'; }

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
function buildEventOptions(domain, selectEl, currentValue) {
  const events = EVENT_MAP[domain] || [];
  selectEl.innerHTML = events.length
    ? '<option value="">— Select Event Type —</option>' + events.map(e => `<option value="${esc(e)}"${e===currentValue?' selected':''}>${esc(e)}</option>`).join('')
    : '<option value="">— Select Domain First —</option>';
  selectEl.disabled = !events.length;
}

function bindDomainCascade(domainId, eventTypeId) {
  $(domainId).addEventListener('change', () => {
    buildEventOptions($(domainId).value, $(eventTypeId), '');
  });
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

/* ── Populate Intelligence Panel with mock data ───────────── */
function populateIntelPanel() {
  const m = MOCK_EXTRACTION;
  $('ip-summary').value    = m.summary;
  $('ip-event-type').value = m.eventType;
  $('ip-location').value   = m.location;
  $('ip-country').value    = m.country;
  $('ip-threats').value    = m.threats;
  $('ip-weapons').value    = m.weapons;
  $('ip-crit-infra').value = m.criticalInfra;
  $('ip-vips').value       = m.vips;
  $('ip-category').value   = m.category;
  $('ip-reasoning').value  = m.reasoning;
  $('ip-fatalities').value = m.fatalities;
  $('ip-injuries').value   = m.injuries;
  $('ip-crowd').value      = m.crowdSize;
  $('ip-confidence').value = m.confidence;

  // Region select
  setSelectValue('ip-region', m.region);
  // Domain select
  setSelectValue('ip-domain', m.domain);
  // Infrastructure select
  setSelectValue('ip-infra', m.infrastructure);
  // Threshold select
  setSelectValue('ip-threshold', m.threshold);

  updateConfidenceBar(m.confidence);
  updateThresholdColor($('ip-threshold'));
}

function setSelectValue(id, value) {
  const el = $(id);
  for (const opt of el.options) {
    if (opt.value === value) { el.value = value; return; }
  }
}

/* ── Analyze Evidence button ───────────────────────────────── */
function initAnalyzeBtn() {
  $('analyzeBtn').addEventListener('click', () => {
    const err  = $('evidenceError');
    const text = $('ev-text').value.trim();
    const url  = $('ev-url').value.trim();
    const region = $('ev-region').value;
    const domain = $('ev-domain').value;

    err.classList.add('hidden');

    if (!text && !url && !attachedFiles.length && !region && !domain) {
      err.textContent = 'Provide at least one evidence source or context field before analyzing.';
      err.classList.remove('hidden');
      return;
    }

    const btn = $('analyzeBtn'), txt = $('analyzeBtnText'), spn = $('analyzeSpinner');
    btn.disabled = true; txt.classList.add('hidden'); spn.classList.remove('hidden');

    setTimeout(() => {
      btn.disabled = false; txt.classList.remove('hidden'); spn.classList.add('hidden');
      populateIntelPanel();
      unlockStep(1);
      goToStep(1);
    }, 1200);
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
  const score = result.riskScore;
  fill.setAttribute('stroke-dasharray', `${(score/100)*GAUGE_ARC} ${GAUGE_CIRC}`);
  fill.className.baseVal = 'gauge-fill ' + scoreGaugeClass(score);
  $('gaugeScore').textContent = score;
  $('gaugeLabel').textContent = scoreLabel(score);

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
document.addEventListener('DOMContentLoaded', () => {
  initStepNav();
  bindDomainCascade('ev-domain', 'ev-eventType');
  bindDomainCascade('domain', 'eventType');
  initCharCount();
  initDropzone();
  initAnalyzeBtn();
  initApproveBtn();
  initConfidenceInput();
  initThresholdSelect();
  initNumButtons();
  $('eventForm').addEventListener('submit', handleEvaluate);
  checkHealth();
  setInterval(checkHealth, 30000);
});
