class RiskScoringEngine {
  constructor(weightLibrary, regionProfiles) {
    this.weights = weightLibrary.weights;
    this.regionProfiles = regionProfiles.regions;
  }

  calculate(eventContext) {
    let score = 0;

    score += (eventContext.fatalities || 0) *
      (this.weights.Fatalities || 0);

    score += (eventContext.injuries || 0) *
      (this.weights.Injuries || 0);

    const region = this.regionProfiles.find(
      r => r.region === eventContext.region
    );

    if (region) {
      score += region.baselineRisk * 10;
    }

    return Math.min(score, 100);
  }
}

module.exports = RiskScoringEngine;
