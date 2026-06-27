'use strict';

const EVENT_MAP = {
  Terrorism: [
    'Bomb Threat','Explosion','Active Shooter','Hostage Situation',
    'Vehicle Attack','Chemical Attack','Biological Attack',
    'Radiological Incident','IED Discovery','Suspicious Package'
  ],
  Conflict: [
    'Military Strike','Border Clash','Drone Strike','Missile Launch',
    'Naval Incident','Airspace Violation','Mobilization','Ceasefire Violation'
  ],
  Crime: ['Robbery','Kidnapping','Homicide','Assault','Burglary','Arson'],
  Politics: [
    'Election','Protest','Demonstration','Government Resignation',
    'Parliament Vote','Executive Order'
  ],
  Cyber: ['Data Breach','Ransomware','DDoS Attack','Website Defacement','Credential Theft'],
  Weather: ['Flood','Earthquake','Hurricane','Wildfire','Tornado','Heatwave','Snowstorm']
};

const ACTION_LABELS = {
  FLASH:         { label: 'FLASH — Immediate Global Escalation', cls: 'action-flash',    sev: 'severity-flash',    gauge: 'gauge-flash' },
  ESCALATE:      { label: 'ESCALATE — High Priority Response',   cls: 'action-escalate', sev: 'severity-escalate', gauge: 'gauge-escalate' },
  WATCH:         { label: 'WATCH — Active Monitoring Required',   cls: 'action-watch',    sev: 'severity-watch',    gauge: 'gauge-watch' },
  LOCAL_URGENT:  { label: 'LOCAL URGENT — Regional Alert',        cls: 'action-local',    sev: 'severity-local',    gauge: 'gauge-local' },
  MONITOR:       { label: 'MONITOR — Routine Surveillance',       cls: 'action-monitor',  sev: 'severity-monitor',  gauge: 'gauge-monitor' }
};

const POLICY_ACTION_STYLE = {
  FLASH:        { bg: 'var(--flash-bg)',    border: 'var(--flash-border)',    color: 'var(--flash-text)' },
  ESCALATE:     { bg: 'var(--escalate-bg)', border: 'var(--escalate-border)', color: 'var(--escalate-text)' },
  WATCH:        { bg: 'var(--watch-bg)',    border: 'var(--watch-border)',    color: 'var(--watch-text)' },
  LOCAL_URGENT: { bg: 'var(--local-bg)',    border: 'var(--local-border)',    color: 'var(--local-text)' },
  MONITOR:      { bg: 'var(--monitor-bg)',  border: 'var(--monitor-border)',  color: 'var(--monitor-text)' }
};

const GAUGE_ARC   = 376.99;
const GAUGE_CIRC  = 565.49;

const $ = id => document.getElementById(id);

function getScoreColor(score) {
  if (score >= 75) return 'gauge-flash';
  if (score >= 50) return 'gauge-escalate';
  if (score >= 25) return 'gauge-watch';
  return 'gauge-monitor';
}

function getScoreLabel(score) {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
}

function setGauge(score) {
  const fill = $('gaugeFill');
  const arc  = (score / 100) * GAUGE_ARC;
  fill.setAttribute('stroke-dasharray', `${arc} ${GAUGE_CIRC}`);

  fill.className.baseVal = 'gauge-fill';
  fill.classList.add(getScoreColor(score));

  $('gaugeScore').textContent = score;
  $('gaugeLabel').textContent = getScoreLabel(score);
}

function renderThreshold(td) {
  const action = td.action || 'MONITOR';
  const info   = ACTION_LABELS[action] || ACTION_LABELS.MONITOR;

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
    const style = POLICY_ACTION_STYLE[p.decisionAction] || POLICY_ACTION_STYLE.MONITOR;
    const item  = document.createElement('div');
    item.className = 'policy-item';
    item.innerHTML = `
      <span class="policy-id">${escHtml(p.id)}</span>
      <div class="policy-body">
        <div class="policy-name">${escHtml(p.name)}</div>
        <div class="policy-desc">${escHtml(p.description || '')}</div>
      </div>
      <span class="policy-action" style="
        background:${style.bg};
        border:1px solid ${style.border};
        color:${style.color};
      ">${escHtml(p.decisionAction)}</span>
    `;
    list.appendChild(item);
  });
}

function renderExplanation(explanation, inputs) {
  $('explanationSummary').textContent = explanation.summary || '—';

  const container = $('explanationInputs');
  container.innerHTML = '';

  const fields = {
    'Event Type':       inputs.eventType,
    'Region':           inputs.region,
    'Domain':           inputs.domain,
    'Fatalities':       inputs.fatalities,
    'Injuries':         inputs.injuries,
    'Infrastructure':   inputs.infrastructureImpact
  };

  Object.entries(fields).forEach(([key, val]) => {
    if (val === undefined || val === null || val === '') return;
    const chip = document.createElement('div');
    chip.className = 'input-chip';
    chip.innerHTML = `<span class="chip-key">${escHtml(key)}</span><span class="chip-val">${escHtml(String(val))}</span>`;
    container.appendChild(chip);
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showError(msg) {
  const el = $('formError');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearError() {
  $('formError').classList.add('hidden');
}

function setLoading(on) {
  $('evaluateBtn').disabled = on;
  $('btnText').classList.toggle('hidden', on);
  $('btnSpinner').classList.toggle('hidden', !on);
}

function setLastEval() {
  const now = new Date();
  $('lastEvalTime').textContent =
    `Last evaluated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
}

async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      $('statusDot').className   = 'status-dot online';
      $('statusLabel').textContent = 'Engine Online';
    } else {
      throw new Error();
    }
  } catch {
    $('statusDot').className   = 'status-dot offline';
    $('statusLabel').textContent = 'Engine Offline';
  }
}

async function submitEvaluation(e) {
  e.preventDefault();
  clearError();

  const domain   = $('domain').value;
  const eventType = $('eventType').value;
  const region   = $('region').value;
  const fatalities = parseInt($('fatalities').value, 10) || 0;
  const injuries   = parseInt($('injuries').value, 10)   || 0;
  const infrastructure = document.querySelector('input[name="infrastructure"]:checked')?.value || 'None';

  if (!domain)    return showError('Please select a domain.');
  if (!eventType) return showError('Please select an event type.');
  if (!region)    return showError('Please select a region.');

  const payload = { eventType, region, domain, fatalities, injuries, infrastructureImpact: infrastructure };

  setLoading(true);

  try {
    const res  = await fetch('/api/decision', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Evaluation failed. Please try again.');
    }

    const { riskScore, thresholdDecision, policies, explanation } = data.result;

    $('resultsPlaceholder').classList.add('hidden');
    const content = $('resultsContent');
    content.classList.remove('hidden');

    void content.offsetWidth;

    setGauge(riskScore);
    renderThreshold(thresholdDecision);
    renderPolicies(policies || []);
    renderExplanation(explanation, payload);
    setLastEval();

  } catch (err) {
    showError(err.message || 'Network error — is the engine running?');
  } finally {
    setLoading(false);
  }
}

function initDomainSelect() {
  const domainEl    = $('domain');
  const eventTypeEl = $('eventType');

  domainEl.addEventListener('change', () => {
    const domain  = domainEl.value;
    const events  = EVENT_MAP[domain] || [];

    eventTypeEl.innerHTML = events.length
      ? '<option value="">— Select Event Type —</option>' +
        events.map(e => `<option value="${escHtml(e)}">${escHtml(e)}</option>`).join('')
      : '<option value="">— Select Domain First —</option>';

    eventTypeEl.disabled = !events.length;
  });
}

function initNumButtons() {
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = $( btn.dataset.target );
      const delta  = parseInt(btn.dataset.delta, 10);
      const val    = Math.max(0, (parseInt(target.value, 10) || 0) + delta);
      target.value = val;
    });
  });
}

function init() {
  initDomainSelect();
  initNumButtons();
  $('eventForm').addEventListener('submit', submitEvaluation);
  checkHealth();
  setInterval(checkHealth, 30000);
}

document.addEventListener('DOMContentLoaded', init);
