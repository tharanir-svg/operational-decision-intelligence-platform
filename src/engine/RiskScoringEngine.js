class RiskScoringEngine {

  constructor(weightLibrary, regionProfiles) {

    this.weights =
      weightLibrary?.weights || {};

    this.regionProfiles =
      regionProfiles?.regions || [];

  }

  calculate(eventContext) {

    const factors = [];

    let score = 0;

    // ==================================================
    // NEW RISK FACTOR ENGINE OUTPUT
    // ==================================================

    const riskFactors =
      Array.isArray(eventContext.riskFactors)
        ? eventContext.riskFactors
        : [];

    /*
     * If RiskFactorEngine has already evaluated the event,
     * use those factors as the authoritative scoring basis.
     *
     * This prevents double-counting fatalities, terrorism,
     * infrastructure, etc.
     */

    if (riskFactors.length > 0) {

      riskFactors.forEach(riskFactor => {

        const points =
          Number(riskFactor.points) || 0;

        score += points;

        factors.push({

          factor:
            riskFactor.name ||
            riskFactor.factor ||
            riskFactor.id ||
            "Risk Factor",

          value:
            riskFactor.value ??
            null,

          points,

          reason:
            riskFactor.reason ||
            "",

          source:
            riskFactor.source ||
            "risk-factor-engine"

        });

      });

    }

    // ==================================================
    // LEGACY FALLBACK
    // ==================================================
    /*
     * If no RiskFactorEngine output exists, retain the
     * existing scoring behaviour.
     *
     * This keeps older event flows functional.
     */

    else {

      // -----------------------------
      // Fatalities
      // -----------------------------

      const fatalities =
        eventContext.fatalities || 0;

      if (fatalities > 0) {

        const points =
          fatalities *
          (this.weights.Fatalities || 0);

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

      const injuries =
        eventContext.injuries || 0;

      if (injuries > 0) {

        const points =
          injuries *
          (this.weights.Injuries || 0);

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

      const region =
        this.regionProfiles.find(
          r =>
            r.region ===
            eventContext.region
        );

      if (region) {

        const points =
          region.baselineRisk * 10;

        score += points;

        factors.push({

          factor:
            "Regional Baseline",

          value:
            region.region,

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

      if (
        criticalEvents.includes(
          eventContext.eventType
        )
      ) {

        score += 10;

        factors.push({

          factor:
            "Critical Event Type",

          value:
            eventContext.eventType,

          points: 10

        });

      }

      // -----------------------------
      // Confidence Bonus
      // -----------------------------

      const confidence =
        eventContext
          .confidenceAssessment
          ?.score || 0;

      if (confidence >= 80) {

        score += 5;

        factors.push({

          factor:
            "High Confidence",

          value:
            confidence,

          points: 5

        });

      }

    }

    // ==================================================
    // FINAL SCORE
    // ==================================================

    const rawScore =
    Math.max(
        score,
        0
    );

const normalizedScore =
    Math.min(
        rawScore,
        100
    );
    // ==================================================
    // SUMMARY
    // ==================================================

    const fatalities =
      eventContext.fatalities || 0;

    const injuries =
      eventContext.injuries || 0;

    const confidence =
      eventContext
        .confidenceAssessment
        ?.score || 0;

    return {

      score,

      factors,

      summary: {

        fatalities,

        injuries,

        region:
          eventContext.region ||
          null,

        confidence,

        eventType:
          eventContext.eventType ||
          null

      }

    };

  }

}

module.exports =
  RiskScoringEngine;