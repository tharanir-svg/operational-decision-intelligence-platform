import DecisionOrchestrator from "./core/DecisionOrchestrator.js";

const engine = new DecisionOrchestrator();

const result = engine.evaluate({
  eventType: "Terrorist Attack",
  domain: "Terrorism",
  fatalities: 5,
  injuries: 12,
  region: "Europe"
});

console.log(JSON.stringify(result, null, 2));
