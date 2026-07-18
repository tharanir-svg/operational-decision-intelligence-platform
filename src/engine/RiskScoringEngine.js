class RiskScoringEngine {

  constructor(weightLibrary, regionProfiles) {
    this.weights = weightLibrary.weights || {};
    this.regionProfiles = regionProfiles.regions || [];
  }

  calculate(eventContext) {

    const factors = [];
    let score = 0;

    // -----------------------------
    // Fatalities
    // -----------------------------
    const fatalities = eventContext.fatalities || 0;

    if (fatalities > 0) {
      const points = fatalities * (this.weights.Fatalities || 0);

      score += points;

      factors.push({
        factor: "Fatalities",
        value: fatalities,
        points
      });
    }

    // -----------------------------
    // Injuries
    // -----------------------------
    const injuries = eventContext.injuries || 0;

    if (injuries > 0) {
      const points = injuries * (this.weights.Injuries || 0);

      score += points;

      factors.push({
        factor: "Injuries",
        value: injuries,
        points
      });
    }

    // -----------------------------
    // Region Baseline
    // -----------------------------
    const region = this.regionProfiles.find(
      r => r.region === eventContext.region
    );

    if (region) {

      const points = region.baselineRisk * 10;

      score += points;

      factors.push({
        factor: "Regional Baseline",
        value: region.region,
        points
      });
    }

    // -----------------------------
    // Event Type Bonus
    // -----------------------------
    const criticalEvents = [
      "Terrorist Attack",
      "Political Assassination",
      "Cyber Attack"
    ];

    if (criticalEvents.includes(eventContext.eventType)) {

      score += 10;

      factors.push({
        factor: "Critical Event Type",
        value: eventContext.eventType,
        points: 10
      });
    }

    // -----------------------------
    // Confidence Bonus
    // -----------------------------
    const confidence =
      eventContext.confidenceAssessment?.score || 0;

    if (confidence >= 80) {

      score += 5;

      factors.push({
        factor: "High Confidence",
        value: confidence,
        points: 5
      });
    }

    // -----------------------------
    // Final Score
    // -----------------------------
    score = Math.min(score, 100);

    return {

      score,

      factors,

      summary: {

        fatalities,

        injuries,

        region: eventContext.region || null,

        confidence,

        eventType: eventContext.eventType || null

      }

    };

  }

}

module.exports = RiskScoringEngine;