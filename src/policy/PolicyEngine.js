class PolicyEngine {
  constructor(policyLibrary) {
    this.policyLibrary = policyLibrary;
  }

  evaluate(eventContext) {
    return this.policyLibrary.policies.filter(policy => {
      if (!policy.appliesTo) return true;
      return (
        policy.appliesTo.includes("All") ||
        policy.appliesTo.includes(eventContext.domain)
      );
    });
  }
}

module.exports = PolicyEngine;
