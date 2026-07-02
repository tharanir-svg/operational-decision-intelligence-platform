'use strict';

/* ── Data ──────────────────────────────────────────────────── */
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

const GAUGE_ARC  = 376.99;
const GAUGE_CIRC = 565.49;

/* ── Helpers ───────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtBytes(n) {
  return n < 1024 ? `${n} B`
    : n < 1048576 ? `${(n/1024).toFixed(1)} KB`
    : `${(n/1048576).toFixed(1)} MB`;
}

function scoreGaugeClass(s) {
  return s >= 75 ? 'gauge-flash' : s >= 50 ? 'gauge-escalate' : s >= 25 ? 'gauge-watch' : 'gauge-monitor';
}
function scoreLabel(s) {
  return s >= 75 ? 'Critical' : s >= 50 ? 'High' : s >= 25 ? 'Moderate' : 'Low';
}

/* ── Tab switching ─────────────────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

/* ── Domain → Event Type cascade (both tabs) ───────────────── */
function bindDomainCascade(domainId, eventTypeId) {
  const domEl  = $(domainId);
  const evtEl  = $(eventTypeId);
  domEl.addEventListener('change', () => {
    const events = EVENT_MAP[domEl.value] || [];
    evtEl.innerHTML = events.length
      ? '<option value="">— Select Event Type —</option>' + events.map(e => `<option value="${esc(e)}">${esc(e)}</option>`).join('')
      : '<option value="">— Select Domain First —</option>';
    evtEl.disabled = !events.length;
  });
}

/* ── Evidence tab: character count ────────────────────────── */
function initCharCount() {
  const ta = $('ev-text');
  const cc = $('charCount');
  ta.addEventListener('input', () => {
    const n = ta.value.length;
    cc.textContent = n.toLocaleString() + ' character' + (n === 1 ? '' : 's');
  });
}

/* ── Drag & Drop Upload Zone ───────────────────────────────── */
let attachedFiles = [];

function renderFileList() {
  const list = $('fileList');
  list.innerHTML = '';
  attachedFiles.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'file-item';

    const isImage = f.type.startsWith('image/');
    let thumbHtml = '';

    if (isImage) {
      const url = URL.createObjectURL(f);
      thumbHtml = `<img class="file-thumb" src="${url}" alt="" />`;
    } else {
      thumbHtml = `<div class="file-thumb-icon"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="8" height="12" rx="1.5" stroke="#4b5d7a" stroke-width="1.3"/><path d="M5 5h4M5 7.5h4M5 10h2" stroke="#4b5d7a" stroke-width="1.1" stroke-linecap="round"/></svg></div>`;
    }

    item.innerHTML = `
      ${thumbHtml}
      <div class="file-info">
        <div class="file-name">${esc(f.name)}</div>
        <div class="file-size">${fmtBytes(f.size)}</div>
      </div>
      <button class="file-remove" data-idx="${i}" title="Remove">×</button>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll('.file-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      attachedFiles.splice(parseInt(btn.dataset.idx, 10), 1);
      renderFileList();
    });
  });
}

function addFiles(newFiles) {
  for (const f of newFiles) {
    if (!attachedFiles.find(x => x.name === f.name && x.size === f.size)) {
      attachedFiles.push(f);
    }
  }
  renderFileList();
}

function initDropzone() {
  const zone    = $('dropzone');
  const input   = $('fileInput');
  const browse  = $('dropzoneBrowse');

  browse.addEventListener('click', e => { e.stopPropagation(); input.click(); });
  zone.addEventListener('click',   () => input.click());
  input.addEventListener('change', () => { addFiles(Array.from(input.files)); input.value = ''; });

  zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', e => {
    if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over');
  });
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    addFiles(files);
  });
}

/* ── Evidence Analyze button (stub) ───────────────────────── */
function initAnalyzeBtn() {
  $('analyzeBtn').addEventListener('click', () => {
    const err = $('evidenceError');
    err.classList.add('hidden');

    const region    = $('ev-region').value;
    const domain    = $('ev-domain').value;
    const eventType = $('ev-eventType').value;
    const text      = $('ev-text').value.trim();
    const url       = $('ev-url').value.trim();

    if (!region && !domain && !text && !url && !attachedFiles.length) {
      err.textContent = 'Please provide at least one evidence source or select a context field.';
      err.classList.remove('hidden');
      return;
    }

    // Stub: AI extraction not yet implemented — show staged confirmation
    const btn = $('analyzeBtn');
    const txt = $('analyzeBtnText');
    const spn = $('analyzeSpinner');

    btn.disabled = true;
    txt.classList.add('hidden');
    spn.classList.remove('hidden');

    setTimeout(() => {
      btn.disabled = false;
      txt.classList.remove('hidden');
      spn.classList.add('hidden');
      err.textContent = 'Evidence staged. AI extraction is coming soon — use Manual tab to run a decision now.';
      err.style.background = 'rgba(37,99,235,.08)';
      err.style.borderColor = 'rgba(37,99,235,.2)';
      err.style.color = '#93c5fd';
      err.classList.remove('hidden');
    }, 900);
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

function setLastEval() {
  $('lastEvalTime').textContent =
    'Last evaluated: ' + new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' });
}

/* ── Results rendering ─────────────────────────────────────── */
function setGauge(score) {
  const fill = $('gaugeFill');
  fill.setAttribute('stroke-dasharray', `${(score / 100) * GAUGE_ARC} ${GAUGE_CIRC}`);
  fill.className.baseVal = 'gauge-fill ' + scoreGaugeClass(score);
  $('gaugeScore').textContent = score;
  $('gaugeLabel').textContent = scoreLabel(score);
}

function renderThreshold(td) {
  const action = td.action || 'MONITOR';
  const info   = ACTION_INFO[action] || ACTION_INFO.MONITOR;

  const el = $('thresholdAction');
  el.textContent = action.replace('_', ' ');
  el.className   = 'threshold-action ' + info.cls;

  const sevEl = $('thresholdSeverity');
  sevEl.textContent = `Severity ${td.severity ?? '—'}`;
  sevEl.className   = 'meta-pill ' + info.sev;

  const srcEl = $('thresholdSource');
  srcEl.textContent = td.source === 'event-rule' ? 'Event Rule' : 'Score Band';
  srcEl.className   = 'meta-pill meta-source';

  const ruleEl = $('thresholdRule');
  if (td.ruleId) {
    ruleEl.textContent = td.ruleId;
    ruleEl.className   = 'meta-pill meta-rule';
    ruleEl.classList.remove('hidden');
  } else {
    ruleEl.classList.add('hidden');
  }

  $('thresholdDesc').textContent = info.label;
}

function renderPolicies(policies) {
  $('policyCount').textContent = policies.length;
  const list = $('policiesList');
  list.innerHTML = '';

  if (!policies.length) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:13px">No policies matched this event.</p>';
    return;
  }

  policies.forEach(p => {
    const st   = POLICY_STYLE[p.decisionAction] || POLICY_STYLE.MONITOR;
    const item = document.createElement('div');
    item.className = 'policy-item';
    item.innerHTML = `
      <span class="policy-id">${esc(p.id)}</span>
      <div class="policy-body">
        <div class="policy-name">${esc(p.name)}</div>
        <div class="policy-desc">${esc(p.description || '')}</div>
      </div>
      <span class="policy-action" style="background:${st.bg};border:1px solid ${st.border};color:${st.color}">${esc(p.decisionAction)}</span>
    `;
    list.appendChild(item);
  });
}

function renderExplanation(explanation, inputs) {
  $('explanationSummary').textContent = explanation.summary || '—';
  const c = $('explanationInputs');
  c.innerHTML = '';
  const fields = { 'Event Type': inputs.eventType, 'Region': inputs.region, 'Domain': inputs.domain, 'Fatalities': inputs.fatalities, 'Injuries': inputs.injuries, 'Infrastructure': inputs.infrastructureImpact };
  Object.entries(fields).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    const ch = document.createElement('div');
    ch.className = 'input-chip';
    ch.innerHTML = `<span class="chip-key">${esc(k)}</span><span class="chip-val">${esc(String(v))}</span>`;
    c.appendChild(ch);
  });
}

function showResults(result, payload) {
  $('resultsPlaceholder').classList.add('hidden');
  const content = $('resultsContent');
  content.classList.remove('hidden');
  void content.offsetWidth;
  setGauge(result.riskScore);
  renderThreshold(result.thresholdDecision);
  renderPolicies(result.policies || []);
  renderExplanation(result.explanation, payload);
  setLastEval();
}

async function handleEvaluate(e) {
  e.preventDefault();
  $('formError').classList.add('hidden');

  const domain    = $('domain').value;
  const eventType = $('eventType').value;
  const region    = $('region').value;
  const fatalities = parseInt($('fatalities').value, 10) || 0;
  const injuries   = parseInt($('injuries').value, 10)   || 0;
  const infrastructure = document.querySelector('input[name="infrastructure"]:checked')?.value || 'None';

  if (!domain)    return showFormError('Please select a domain.');
  if (!eventType) return showFormError('Please select an event type.');
  if (!region)    return showFormError('Please select a region.');

  const payload = { eventType, region, domain, fatalities, injuries, infrastructureImpact: infrastructure };

  setLoading(true);
  try {
    const res  = await fetch('/api/decision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Evaluation failed.');
    showResults(data.result, payload);
  } catch (err) {
    showFormError(err.message || 'Network error — is the engine running?');
  } finally {
    setLoading(false);
  }
}

/* ── Number steppers ───────────────────────────────────────── */
function initNumButtons() {
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const el  = $(btn.dataset.target);
      el.value  = Math.max(0, (parseInt(el.value, 10) || 0) + parseInt(btn.dataset.delta, 10));
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
  initTabs();
  bindDomainCascade('domain', 'eventType');
  bindDomainCascade('ev-domain', 'ev-eventType');
  initCharCount();
  initDropzone();
  initAnalyzeBtn();
  initNumButtons();
  $('eventForm').addEventListener('submit', handleEvaluate);
  checkHealth();
  setInterval(checkHealth, 30000);
});
