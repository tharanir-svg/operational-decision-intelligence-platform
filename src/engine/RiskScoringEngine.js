class RiskScoringEngine {

  constructor(weightLibrary, regionLibrary) {

    this.weights =
      weightLibrary.weights || {};

    this.regions =
      regionLibrary.regions || [];

  }

  calculate(eventContext) {

    let score = 0;

    // Fatalities
    score +=
      (eventContext.fatalities || 0) *
      (this.weights.Fatalities || 10);

    // Injuries
    score +=
      (eventContext.injuries || 0) *
      (this.weights.Injuries || 5);

    // Critical Infrastructure
    if (eventContext.infrastructureImpact === true) {

      score +=
        this.weights.CriticalInfrastructure || 25;

    }

    // Regional Risk Modifier
    const region =
      this.regions.find(r =>
        r.region === eventContext.region
      );

    if (region) {

      score +=
        region.baselineRisk * 10;

    }

    // Source Confidence Modifier
    if (eventContext.sourceConfidence) {

      switch (
        eventContext.sourceConfidence.toLowerCase()
      ) {

        case "high":
          score += 10;
          break;

        case "medium":
          score += 5;
          break;

        case "low":
          score += 2;
          break;

      }

    }

    // Cap score at 100
    score = Math.min(score, 100);

    return score;

  }

}

module.exports =
  RiskScoringEngine;