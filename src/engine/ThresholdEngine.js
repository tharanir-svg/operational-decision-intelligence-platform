class ThresholdEngine {

  constructor(thresholdMatrix) {

    this.matrix =
      thresholdMatrix.thresholds || [];

  }

  evaluate(riskScore) {

    for (const threshold of this.matrix) {

      if (riskScore >= threshold.minimumScore) {
        return threshold;
      }

    }

    return {
      level: "Monitor",
      minimumScore: 0
    };

  }

}

module.exports =
  ThresholdEngine;