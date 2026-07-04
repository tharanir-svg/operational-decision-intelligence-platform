const express = require("express");

/* ── Mock extraction scenarios ─────────────────────────────────
   Keyword matching will be replaced by a Gemini call when the
   AI layer is wired in. Each scenario mirrors the agreed schema.
──────────────────────────────────────────────────────────────── */
const SCENARIOS = {

  terrorism: {
    incidentSummary:       "Coordinated bomb blast reported near the central market district in Karachi, Pakistan. A vehicle-borne IED detonated during morning rush hour, targeting a densely populated civilian area. Pakistani emergency services confirmed multiple fatalities and dozens of injuries on scene. Security forces have cordoned the area and a secondary device was reportedly discovered nearby, indicating a multi-phase operation.",
    eventType:             "Explosion",
    location:              "Central Market District, Karachi",
    domain:                "Terrorism",
    country:               "Pakistan",
    region:                "South Asia",
    confidence:            87,
    fatalities:            12,
    injuries:              47,
    infrastructureImpact:  "Moderate",
    crowdSize:             300,
    weapons:               ["Vehicle-borne IED", "Explosive device", "Secondary device"],
    criticalInfrastructure:["Transport corridor", "Central market district", "Communication nodes"],
    vipMentioned:          false,
    threatIndicators:      ["Vehicle-borne IED", "Coordinated attack", "Civilian targeting", "Rush hour timing", "Secondary device reported"],
    recommendedCategory:   "Terrorist Attack",
    suggestedThreshold:    "FLASH",
    reasoning:             "The incident exhibits hallmarks of a coordinated terrorist attack: deliberate timing during peak civilian activity, deployment of a vehicle-borne IED, and targeting of a densely populated commercial zone. Confirmed fatality count (12) surpasses the THR-001 mass-casualty threshold. The South Asia regional baseline risk multiplier further elevates the aggregate risk score. Pattern analysis indicates possible affiliation with regional threat actors known to operate in Sindh province. Secondary device discovery suggests operational complexity consistent with a multi-phase attack. Recommendation: immediate FLASH escalation and activation of continuity protocols."
  },

  conflict: {
    incidentSummary:       "Confirmed drone strikes on multiple military installations in northern Syria. Initial reports from regional correspondents indicate significant damage to an air defence battery and an ammunition depot. Anti-aircraft fire was observed preceding the strikes. No civilian casualties have been reported at this stage, but displacement in surrounding villages is ongoing.",
    eventType:             "Drone Strike",
    location:              "Northern Syria",
    domain:                "Conflict",
    country:               "Syria",
    region:                "Middle East",
    confidence:            79,
    fatalities:            4,
    injuries:              11,
    infrastructureImpact:  "Severe",
    crowdSize:             0,
    weapons:               ["Loitering munitions", "Anti-aircraft system"],
    criticalInfrastructure:["Air defence battery", "Ammunition depot", "Military airfield"],
    vipMentioned:          false,
    threatIndicators:      ["Precision strike capability", "Multi-target coordination", "Air defence suppression"],
    recommendedCategory:   "Military Strike",
    suggestedThreshold:    "ESCALATE",
    reasoning:             "Simultaneous precision strikes on hardened military installations indicate a state or state-proximate actor with advanced UAV capability. Destruction of an air defence battery has immediate escalatory implications for regional airspace security. Casualty count remains low but infrastructure damage is severe. No evidence of civilian targeting; event assessed as inter-state or proxy conflict. ESCALATE threshold triggered under POL-007 (conflict escalation in high-risk region) with Severity 3 classification."
  },

  weather: {
    incidentSummary:       "Severe flash flooding following three days of above-average monsoon rainfall in eastern Bangladesh. Multiple districts have reported inundation of residential areas, with the Jamuna river exceeding danger levels at three gauge stations. National Disaster Management Authority has activated emergency protocols and pre-positioned relief teams.",
    eventType:             "Flood",
    location:              "Eastern Bangladesh",
    domain:                "Weather",
    country:               "Bangladesh",
    region:                "South Asia",
    confidence:            92,
    fatalities:            8,
    injuries:              63,
    infrastructureImpact:  "Severe",
    crowdSize:             15000,
    weapons:               [],
    criticalInfrastructure:["Road network", "Flood embankments", "Power grid sub-stations", "Drinking water infrastructure"],
    vipMentioned:          false,
    threatIndicators:      ["River above danger level", "Continued rainfall forecast", "Mass displacement risk"],
    recommendedCategory:   "Natural Disaster",
    suggestedThreshold:    "ESCALATE",
    reasoning:             "Cumulative rainfall and gauge readings confirm an extreme weather event with high confidence. Fatality count is rising and infrastructure damage to flood defences increases downstream exposure. Crowd size (15,000 displaced) triggers mass-casualty protocols under THR-002. No security dimension detected; risk is purely humanitarian and logistical. Suggested threshold: ESCALATE with regional humanitarian response activation."
  },

  cyber: {
    incidentSummary:       "Ransomware attack attributed to a financially motivated threat group has encrypted critical systems across at least 14 hospitals in the United Kingdom. The attack vector was a phishing email targeting NHS trust administrative staff. Patient records are inaccessible, elective surgeries have been cancelled, and emergency patients are being diverted to unaffected facilities.",
    eventType:             "Ransomware",
    location:              "United Kingdom (multiple NHS trusts)",
    domain:                "Cyber",
    country:               "United Kingdom",
    region:                "Europe",
    confidence:            83,
    fatalities:            0,
    injuries:              0,
    infrastructureImpact:  "Severe",
    crowdSize:             0,
    weapons:               ["Ransomware payload", "Phishing kit"],
    criticalInfrastructure:["NHS hospital network", "Patient records systems", "Emergency dispatch"],
    vipMentioned:          false,
    threatIndicators:      ["Healthcare sector targeting", "Multi-site simultaneous infection", "Patient safety risk", "Ransom demand issued"],
    recommendedCategory:   "Cyber Attack",
    suggestedThreshold:    "ESCALATE",
    reasoning:             "Multi-site simultaneous attack on healthcare critical national infrastructure represents a high-severity cyber incident under CNI-004. Direct patient safety risk arising from system unavailability elevates this beyond a standard ransomware event. Attribution to a financially motivated group reduces geopolitical escalation risk but does not reduce operational impact severity. ESCALATE recommended with immediate engagement of NCSC incident response protocols."
  }

};

/* ── Keyword detection (stub for Gemini routing logic) ─────── */
function detectScenario(text, url) {
  const haystack = ((text || "") + " " + (url || "")).toLowerCase();
  if (/bomb|blast|explos|ied|terror|attack|shoot|hostage|weapon/i.test(haystack)) return "terrorism";
  if (/drone|strike|missile|military|conflict|troop|artillery|ceasefire/i.test(haystack)) return "conflict";
  if (/flood|earthquake|hurricane|cyclone|wildfire|tornado|typhoon|monsoon/i.test(haystack)) return "weather";
  if (/ransomware|breach|hack|cyber|malware|phish|ddos/i.test(haystack)) return "cyber";
  return "terrorism"; // default
}

/* ── Validation ────────────────────────────────────────────── */
function validatePayload(body) {
  const { text, url, images, videos } = body;
  const hasText   = typeof text   === "string" && text.trim().length > 0;
  const hasUrl    = typeof url    === "string" && url.trim().length  > 0;
  const hasImages = Array.isArray(images) && images.length > 0;
  const hasVideos = Array.isArray(videos) && videos.length > 0;
  return hasText || hasUrl || hasImages || hasVideos;
}

/* ── Router ────────────────────────────────────────────────── */
module.exports = function createExtractAPI() {
  const router = express.Router();

  /**
   * POST /api/extract
   *
   * Body (application/json):
   *   text   {string}  — pasted article / raw intelligence
   *   url    {string}  — source URL (optional)
   *   images {Array}   — [{ name, size, type }, …] file metadata
   *   videos {Array}   — [{ name, size, type }, …] file metadata
   *
   * Returns the ODIP extraction schema.
   * TODO: replace mock with Gemini API call.
   */
  router.post("/extract", async (req, res) => {
    try {
      const { text, url, images = [], videos = [] } = req.body;

      if (!validatePayload(req.body)) {
        return res.status(400).json({
          success: false,
          error:   "At least one of: text, url, images, or videos must be provided."
        });
      }

      const intelligence =
    await service.extractEvidence({
        evidenceText: text,
        sourceUrl: url
    });
      const result = {
        incidentSummary:        mock.incidentSummary,
        eventType:              mock.eventType,
        location:               mock.location,
        domain:                 mock.domain,
        country:                mock.country,
        region:                 mock.region,
        confidence:             mock.confidence,
        fatalities:             mock.fatalities,
        injuries:               mock.injuries,
        infrastructureImpact:   mock.infrastructureImpact,
        crowdSize:              mock.crowdSize,
        weapons:                mock.weapons,
        criticalInfrastructure: mock.criticalInfrastructure,
        vipMentioned:           mock.vipMentioned,
        threatIndicators:       mock.threatIndicators,
        recommendedCategory:    mock.recommendedCategory,
        suggestedThreshold:     mock.suggestedThreshold,
        reasoning:              mock.reasoning,
        _meta: {
          source:    "mock",
          scenario:  scenarioKey,
          inputs: {
            hasText:    typeof text === "string" && text.trim().length > 0,
            hasUrl:     typeof url  === "string" && url.trim().length  > 0,
            imageCount: images.length,
            videoCount: videos.length
          }
        }
      };

      res.json({ success: true, timestamp: new Date().toISOString(), result });

    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
};
