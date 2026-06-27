class PolicyEngine {

  constructor(policyLibrary) {
    this.policies =
      policyLibrary.policies || [];
  }

  evaluate(eventContext) {

    return this.policies.filter(policy => {

      // Baseline policy always applies
      if (policy.category === "Baseline") {
        return true;
      }

      // Threshold-based policies
      if (policy.threshold) {

        if (
          policy.threshold.fatalities &&
          eventContext.fatalities >=
          policy.threshold.fatalities
        ) {
          return true;
        }

        if (
          policy.threshold.injuries &&
          eventContext.injuries >=
          policy.threshold.injuries
        ) {
          return true;
        }

      }

      // Category match
      if (
        eventContext.category &&
        eventContext.category ===
        policy.category
      ) {
        return true;
      }

      return false;

    });

  }

}

module.exports =
  PolicyEngine;