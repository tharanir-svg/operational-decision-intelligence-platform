const test = require("node:test");
const assert = require("node:assert/strict");

const ValidatorV2 =
    require("../src/extraction/ValidatorV2");

const DecisionOrchestrator =
    require("../src/core/DecisionOrchestrator");

const ThresholdEngine =
    require("../src/engine/ThresholdEngine");

const thresholdMatrix =
    require("../knowledge/policies/threshold-matrix.json");

const RecommendationEngine =
    require("../src/engine/RecommendationEngine");

const recommendationLibrary =
    require("../knowledge/policies/recommendation-library.json");

function validate(input) {

    const validator =
        new ValidatorV2();

    return validator.validate(
        structuredClone(input)
    );

}


function evaluate(input) {

    const validator =
        new ValidatorV2();

    const validated =
        validator.validate(
            structuredClone(input)
        );


    const orchestrator =
        new DecisionOrchestrator();


    const result =
        orchestrator.evaluate({
            ...validated,

            fatalities:
                validated.casualties.fatalities,

            injuries:
                validated.casualties.injuries
        });


    return {
        validated,
        result
    };

}


//==================================================
// 1. WHITE HOUSE — CRITICAL INFRASTRUCTURE TERRORISM
//==================================================

test(
    "White House suicide bombing -> Severe, 110, FLASH -> GLOBAL",
    () => {

        const {
            validated,
            result
        } =
            evaluate({

                summary:
                    "A suicide bombing occurred in the vicinity of the White House in Washington, D.C., resulting in 20 fatalities.",

                originalText:
                    "A suicide bombing occurred in the vicinity of the White House in Washington, D.C., resulting in 20 fatalities.",

                eventType:
                    "Suicide Bombing",

                domain:
                    "Terrorism",

                region:
                    "",

                country:
                    "United States",

                city:
                    "Washington, D.C.",

                casualties: {
                    fatalities: 20,
                    injuries: 0
                },

                crowdSize:
                    0,

                // Deliberately lower than expected.
                // Validator must upgrade this.
                infrastructureImpact:
                    "Moderate",

                criticalInfrastructure: [
                    "White House"
                ],

                threatIndicators: [
                    "Suicide attack"
                ],

                weapons: [
                    "Explosive device"
                ],

                organizations: [],
                persons: [],

                suggestedCategory:
                    "Security",

                suggestedThreshold:
                    "FLASH",

                reasoning:
                    "",

                recommendedActions:
                    []

            });


        assert.equal(
            validated.eventType,
            "Suicide Bombing"
        );


        assert.equal(
            validated.domain,
            "Terrorism"
        );


        assert.equal(
            validated.region,
            "North America"
        );


        assert.equal(
            validated.infrastructureImpact,
            "Severe"
        );


        assert.equal(
            validated.suggestedThreshold,
            "FLASH"
        );


        assert.equal(
            result.riskScore.score,
            110
        );


        const factorNames =
            result.riskScore.factors.map(
                factor =>
                    factor.factor
            );


        assert.ok(
            factorNames.includes(
                "Extreme Fatality Count"
            )
        );


        assert.ok(
            factorNames.includes(
                "Mass Casualty Event"
            )
        );


        assert.ok(
            factorNames.includes(
                "Severe Infrastructure Impact"
            )
        );


        assert.ok(
            factorNames.includes(
                "Terrorism Baseline"
            )
        );


        assert.ok(
            factorNames.includes(
                "Critical Infrastructure Identified"
            )
        );


        assert.equal(
            result.thresholdDecision.action,
            "FLASH"
        );


        assert.equal(
            result.overrideDecision.initialDecision,
            "FLASH"
        );


        assert.equal(
            result.overrideDecision.finalDecision,
            "GLOBAL"
        );


        assert.equal(
            result.overrideDecision.overridden,
            true
        );


        assert.equal(
            result.overrideDecision.overrideReason,
            "Critical Infrastructure Terrorism"
        );


        assert.equal(
            result.recommendedActions.kineticEvent,
            true
        );

    }
);


//==================================================
// 2. PHILADELPHIA — MASS SHOOTING / CRIME
//==================================================

test(
    "Philadelphia mass shooting -> Crime, 55, FLASH",
    () => {

        const {
            validated,
            result
        } =
            evaluate({

                summary:
                    "A mass shooting incident occurred at Philadelphia City Hall resulting in 15 injuries.",

                originalText:
                    "A mass shooting incident occurred at Philadelphia City Hall resulting in 15 injuries.",

                eventType:
                    "Mass Shooting",

                // Deliberately wrong AI classification.
                domain:
                    "Terrorism",

                region:
                    "",

                country:
                    "United States",

                city:
                    "Philadelphia",

                casualties: {
                    fatalities: 0,
                    injuries: 15
                },

                crowdSize:
                    0,

                infrastructureImpact:
                    "Minor",

                criticalInfrastructure: [
                    "Philadelphia City Hall"
                ],

                threatIndicators: [
                    "Active Shooter",
                    "Mass Casualty Event"
                ],

                weapons: [
                    "Firearm"
                ],

                organizations: [],
                persons: [],

                suggestedCategory:
                    "Violent Crime / Terrorism",

                // Deliberately wrong.
                suggestedThreshold:
                    "MONITOR",

                reasoning:
                    "",

                recommendedActions:
                    []

            });


        assert.equal(
            validated.domain,
            "Crime"
        );


        assert.equal(
            validated.eventType,
            "Mass Shooting"
        );


        assert.equal(
            validated.region,
            "North America"
        );


        assert.equal(
            validated.infrastructureImpact,
            "Minor"
        );


        assert.equal(
            validated.suggestedCategory,
            "Violent Crime"
        );


        assert.equal(
            validated.suggestedThreshold,
            "FLASH"
        );


        assert.equal(
            result.riskScore.score,
            55
        );


        const factorNames =
            result.riskScore.factors.map(
                factor =>
                    factor.factor
            );


        assert.ok(
            factorNames.includes(
                "Confirmed Injury Burden"
            )
        );


        assert.ok(
            factorNames.includes(
                "Critical Infrastructure Identified"
            )
        );


        assert.equal(
            factorNames.includes(
                "Terrorism Baseline"
            ),
            false
        );


        assert.equal(
            result.thresholdDecision.action,
            "FLASH"
        );


        assert.equal(
            result.thresholdDecision.ruleId,
            "THR-MASS-CASUALTY-INJURIES"
        );


        assert.equal(
            result.overrideDecision.finalDecision,
            "FLASH"
        );


        assert.equal(
            result.overrideDecision.overridden,
            false
        );


        assert.equal(
            result.recommendedActions.kineticEvent,
            true
        );

    }
);


//==================================================
// 3. CONFIRMED FATALITY BASELINE
//==================================================

test(
    "One confirmed fatality establishes LOCAL_URGENT minimum",
    () => {

        const {
            validated,
            result
        } =
            evaluate({

                summary:
                    "One person was killed in a shooting incident.",

                eventType:
                    "Shooting",

                domain:
                    "Crime",

                region:
                    "",

                country:
                    "United States",

                city:
                    "Chicago",

                casualties: {
                    fatalities: 1,
                    injuries: 0
                },

                infrastructureImpact:
                    "None",

                criticalInfrastructure: [],

                threatIndicators: [],
                weapons: [
                    "Firearm"
                ],

                organizations: [],
                persons: [],

                suggestedCategory:
                    "Violent Crime",

                suggestedThreshold:
                    "SIGNAL",

                reasoning:
                    "",

                recommendedActions:
                    []

            });


        assert.equal(
            validated.suggestedThreshold,
            "LOCAL_URGENT"
        );


        assert.equal(
            result.thresholdDecision.action,
            "LOCAL_URGENT"
        );


        assert.equal(
            result.thresholdDecision.ruleId,
            "THR-CONFIRMED-FATALITY"
        );

    }
);


//==================================================
// 4. LOW-SEVERITY SIGNAL
//==================================================

test(
    "Low-severity incident remains SIGNAL",
    () => {

        const {
            result
        } =
            evaluate({

                summary:
                    "A burglary was reported with no injuries or fatalities.",

                eventType:
                    "Burglary",

                domain:
                    "Crime",

                region:
                    "",

                country:
                    "United States",

                city:
                    "Boston",

                casualties: {
                    fatalities: 0,
                    injuries: 0
                },

                infrastructureImpact:
                    "None",

                criticalInfrastructure: [],

                threatIndicators: [],
                weapons: [],
                organizations: [],
                persons: [],

                suggestedCategory:
                    "Crime",

                suggestedThreshold:
                    "SIGNAL",

                reasoning:
                    "",

                recommendedActions:
                    []

            });


        assert.equal(
            result.thresholdDecision.action,
            "SIGNAL"
        );


        assert.equal(
            result.overrideDecision.finalDecision,
            "SIGNAL"
        );

    }
);


//==================================================
// 5. SCORE BAND — NATIONAL URGENT
//==================================================

test(
    "Risk score 55 maps to NATIONAL_URGENT when no stronger rule exists",
    () => {

        const engine =
            new ThresholdEngine(
                thresholdMatrix
            );


        const decision =
            engine.evaluate(
                {
                    eventType:
                        "Burglary",

                    fatalities:
                        0,

                    injuries:
                        0,

                    criticalInfrastructure:
                        []
                },
                55
            );


        assert.equal(
            decision.action,
            "NATIONAL_URGENT"
        );


        assert.equal(
            decision.severity,
            3
        );

    }
);


//==================================================
// 6. SCORE BAND — GLOBAL URGENT
//==================================================

test(
    "Risk score 80 maps to GLOBAL_URGENT when no stronger rule exists",
    () => {

        const engine =
            new ThresholdEngine(
                thresholdMatrix
            );


        const decision =
            engine.evaluate(
                {
                    eventType:
                        "Burglary",

                    fatalities:
                        0,

                    injuries:
                        0,

                    criticalInfrastructure:
                        []
                },
                80
            );


        assert.equal(
            decision.action,
            "GLOBAL_URGENT"
        );


        assert.equal(
            decision.severity,
            4
        );

    }
);


//==================================================
// 7. EVENT RULE MUST OUTRANK LOWER SCORE BAND
//==================================================

test(
    "Mass casualty injury rule outranks NATIONAL_URGENT score band",
    () => {

        const engine =
            new ThresholdEngine(
                thresholdMatrix
            );


        const decision =
            engine.evaluate(
                {
                    eventType:
                        "Mass Shooting",

                    fatalities:
                        0,

                    injuries:
                        15,

                    criticalInfrastructure:
                        []
                },
                55
            );


        assert.equal(
            decision.action,
            "FLASH"
        );


        assert.equal(
            decision.ruleId,
            "THR-MASS-CASUALTY-INJURIES"
        );


        assert.equal(
            decision.scoreBandDecision,
            "NATIONAL_URGENT"
        );

    }
);


//==================================================
// 8. MASS-CASUALTY FATALITY RULE
//==================================================

test(
    "Three fatalities trigger FLASH regardless of event type",
    () => {

        const engine =
            new ThresholdEngine(
                thresholdMatrix
            );


        const decision =
            engine.evaluate(
                {
                    eventType:
                        "Road Accident",

                    fatalities:
                        3,

                    injuries:
                        0,

                    criticalInfrastructure:
                        []
                },
                15
            );


        assert.equal(
            decision.action,
            "FLASH"
        );


        assert.equal(
            decision.ruleId,
            "THR-MASS-CASUALTY-FATALITIES"
        );

    }
);
//==================================================
// 9. CYBER + CRITICAL INFRASTRUCTURE
//==================================================

test(
    "Cyber Security incident involving critical infrastructure -> GLOBAL_URGENT",
    () => {

        const engine =
            new ThresholdEngine(
                thresholdMatrix
            );


        const decision =
            engine.evaluate(
                {
                    eventType:
                        "Ransomware",

                    domain:
                        "Cyber Security",

                    fatalities:
                        0,

                    injuries:
                        0,

                    infrastructureImpact:
                        "Moderate",

                    criticalInfrastructure: [
                        "Regional Power Grid"
                    ]
                },
                10
            );


        assert.equal(
            decision.action,
            "GLOBAL_URGENT"
        );


        assert.equal(
            decision.ruleId,
            "THR-CYBER-CRITICAL-INFRASTRUCTURE"
        );

    }
);

//==================================================
// 10. NATIONAL URGENT + KINETIC WORKFLOW
//==================================================

//==================================================
// 10. NATIONAL URGENT + KINETIC WORKFLOW
//==================================================

test(
    "NATIONAL_URGENT kinetic event adds active update workflow",
    () => {

        const engine =
            new RecommendationEngine(
                recommendationLibrary
            );


        const result =
            engine.generate(
                "NATIONAL_URGENT",
                {

                    domain:
                        "Crime",

                    eventType:
                        "Shooting",

                    region:
                        "North America",

                    country:
                        "United States",

                    city:
                        "Atlanta",

                    fatalities:
                        0,

                    injuries:
                        0,

                    casualties: {
                        fatalities: 0,
                        injuries: 0
                    },

                    infrastructureImpact:
                        "Moderate",

                    criticalInfrastructure: [
                        "Transit Hub"
                    ],

                    threatIndicators: [
                        "Active shooter"
                    ],

                    weapons: [
                        "Firearm"
                    ],

                    organizations: [],
                    persons: []

                },
                []
            );


        assert.equal(
            result.level,
            "NATIONAL_URGENT"
        );


        assert.equal(
            result.kineticEvent,
            true
        );


        const actions =
            result.actions.map(
                item =>
                    item.action
            );


        assert.ok(
            actions.includes(
                "Send National Urgent alert from the tool"
            )
        );


        assert.ok(
            actions.includes(
                "Inform the team that this is a kinetic event requiring active follow-up"
            )
        );


        assert.ok(
            actions.includes(
                "Initiate active update search using approved Boolean or AI-assisted sources"
            )
        );


        assert.equal(
            result.totalActions,
            3
        );

    }
);

//==================================================
// 11. NATIONAL URGENT + NON-KINETIC WORKFLOW
//==================================================

test(
    "NATIONAL_URGENT non-kinetic event does not add active update workflow",
    () => {

        const engine =
            new RecommendationEngine(
                recommendationLibrary
            );


        const result =
            engine.generate(
                "NATIONAL_URGENT",
                {

                    domain:
                        "Political",

                    eventType:
                        "Government Policy Change",

                    region:
                        "North America",

                    country:
                        "United States",

                    city:
                        "Washington, D.C.",

                    fatalities:
                        0,

                    injuries:
                        0,

                    casualties: {
                        fatalities: 0,
                        injuries: 0
                    },

                    infrastructureImpact:
                        "None",

                    criticalInfrastructure:
                        [],

                    threatIndicators:
                        [],

                    weapons:
                        [],

                    organizations:
                        [],

                    persons:
                        []

                },
                []
            );


        assert.equal(
            result.level,
            "NATIONAL_URGENT"
        );


        assert.equal(
            result.kineticEvent,
            false
        );


        const actions =
            result.actions.map(
                item =>
                    item.action
            );


        assert.ok(
            actions.includes(
                "Send National Urgent alert from the tool"
            )
        );


        assert.equal(
            actions.includes(
                "Inform the team that this is a kinetic event requiring active follow-up"
            ),
            false
        );


        assert.equal(
            actions.includes(
                "Initiate active update search using approved Boolean or AI-assisted sources"
            ),
            false
        );


        assert.equal(
            result.totalActions,
            1
        );

    }
);
//==================================================
// 12. GLOBAL URGENT WORKFLOW
//==================================================

test(
    "GLOBAL_URGENT uses upgrade and HPW workflow",
    () => {

        const engine =
            new RecommendationEngine(
                recommendationLibrary
            );


        const result =
            engine.generate(
                "GLOBAL_URGENT",
                {

                    domain:
                        "Cyber Security",

                    eventType:
                        "Ransomware",

                    region:
                        "North America",

                    country:
                        "United States",

                    city:
                        "New York",

                    fatalities:
                        0,

                    injuries:
                        0,

                    casualties: {
                        fatalities: 0,
                        injuries: 0
                    },

                    infrastructureImpact:
                        "Moderate",

                    criticalInfrastructure: [
                        "Power Grid"
                    ],

                    threatIndicators:
                        [],

                    weapons:
                        [],

                    organizations:
                        [],

                    persons:
                        []

                },
                []
            );


        assert.equal(
            result.level,
            "GLOBAL_URGENT"
        );


        assert.equal(
            result.kineticEvent,
            false
        );


        const actions =
            result.actions.map(
                item =>
                    item.action
            );


        assert.ok(
            actions.includes(
                "Upgrade in tool and flag client as #HPW — High Priority Workflow"
            )
        );


        assert.equal(
            actions.includes(
                "Send Global Urgent alert from the tool"
            ),
            false
        );


        assert.equal(
            result.totalActions,
            1
        );

    }
);
//==================================================
// 13. WEATHER / NON-SECURITY EVENT
//==================================================

test(
    "Severe weather event remains Weather and does not receive terrorism baseline",
    () => {

        const {
            validated,
            result
        } =
            evaluate({

                summary:
                    "A major earthquake damaged a regional hospital. No fatalities or injuries were reported.",

                originalText:
                    "A major earthquake damaged a regional hospital. No fatalities or injuries were reported.",

                eventType:
                    "Earthquake",

                domain:
                    "Weather",

                region:
                    "",

                country:
                    "United States",

                city:
                    "San Francisco",

                casualties: {
                    fatalities: 0,
                    injuries: 0
                },

                crowdSize:
                    0,

                infrastructureImpact:
                    "Severe",

                criticalInfrastructure: [
                    "Regional Hospital"
                ],

                threatIndicators:
                    [],

                weapons:
                    [],

                organizations:
                    [],

                persons:
                    [],

                suggestedCategory:
                    "Natural Hazard",

                suggestedThreshold:
                    "SIGNAL",

                reasoning:
                    "",

                recommendedActions:
                    []

            });


        assert.equal(
            validated.domain,
            "Weather"
        );


        assert.equal(
            validated.eventType,
            "Earthquake"
        );


        assert.equal(
            validated.region,
            "North America"
        );


        assert.equal(
            validated.infrastructureImpact,
            "Severe"
        );


        assert.equal(
            result.riskScore.score,
            35
        );


        const factorNames =
            result.riskScore.factors.map(
                factor =>
                    factor.factor
            );


        assert.ok(
            factorNames.includes(
                "Severe Infrastructure Impact"
            )
        );


        assert.ok(
            factorNames.includes(
                "Critical Infrastructure Identified"
            )
        );


        assert.equal(
            factorNames.includes(
                "Terrorism Baseline"
            ),
            false
        );


        assert.equal(
            result.thresholdDecision.action,
            "LOCAL_URGENT"
        );


        assert.equal(
            result.recommendedActions.kineticEvent,
            false
        );

    }
);
//==================================================
// 14. AMBIGUOUS MASS SHOOTING + TERRORISM EVIDENCE
//==================================================

test(
    "Mass Shooting with explicit terrorism evidence resolves to Terrorism",
    () => {

        const {
            validated,
            result
        } =
            evaluate({

                summary:
                    "A mass shooting occurred at a public venue. Authorities described the attack as ideologically motivated and said a terrorist organization claimed responsibility. No fatalities or injuries have been confirmed.",

                originalText:
                    "A mass shooting occurred at a public venue. Authorities described the attack as ideologically motivated and said a terrorist organization claimed responsibility. No fatalities or injuries have been confirmed.",

                eventType:
                    "Mass Shooting",

                // Deliberately supplied as Crime.
                // Explicit terrorism evidence should override this.
                domain:
                    "Crime",

                region:
                    "",

                country:
                    "United States",

                city:
                    "Denver",

                casualties: {
                    fatalities: 0,
                    injuries: 0
                },

                crowdSize:
                    0,

                infrastructureImpact:
                    "None",

                criticalInfrastructure:
                    [],

                threatIndicators: [
                    "Ideologically motivated",
                    "Terrorist organization claimed responsibility"
                ],

                weapons: [
                    "Firearm"
                ],

                organizations: [
                    "Terrorist organization"
                ],

                persons:
                    [],

                suggestedCategory:
                    "Violent Crime",

                suggestedThreshold:
                    "SIGNAL",

                reasoning:
                    "",

                recommendedActions:
                    []

            });


        assert.equal(
            validated.domain,
            "Terrorism"
        );


        assert.equal(
            validated.eventType,
            "Mass Shooting"
        );


        assert.equal(
            validated.suggestedCategory,
            "Security"
        );


        assert.equal(
            result.riskScore.score,
            20
        );


        const factorNames =
            result.riskScore.factors.map(
                factor =>
                    factor.factor
            );


        assert.ok(
            factorNames.includes(
                "Terrorism Baseline"
            )
        );


        assert.equal(
            result.thresholdDecision.action,
            "SIGNAL"
        );

    }
);
//==================================================
// 15. AMBIGUOUS MASS SHOOTING WITHOUT TERRORISM EVIDENCE
//==================================================

test(
    "Mass Shooting without terrorism evidence resolves to Crime",
    () => {

        const {
            validated,
            result
        } =
            evaluate({

                summary:
                    "A mass shooting occurred at a shopping mall. Police reported an active shooter incident. No fatalities or injuries have been confirmed.",

                originalText:
                    "A mass shooting occurred at a shopping mall. Police reported an active shooter incident. No fatalities or injuries have been confirmed.",

                eventType:
                    "Mass Shooting",

                // Deliberately supplied incorrectly as Terrorism.
                // Without terrorism evidence, Validator should
                // resolve the ambiguous event to Crime.
                domain:
                    "Terrorism",

                region:
                    "",

                country:
                    "United States",

                city:
                    "Dallas",

                casualties: {
                    fatalities: 0,
                    injuries: 0
                },

                crowdSize:
                    0,

                infrastructureImpact:
                    "None",

                criticalInfrastructure:
                    [],

                threatIndicators: [
                    "Active Shooter"
                ],

                weapons: [
                    "Firearm"
                ],

                organizations:
                    [],

                persons:
                    [],

                suggestedCategory:
                    "Security",

                suggestedThreshold:
                    "SIGNAL",

                reasoning:
                    "",

                recommendedActions:
                    []

            });


        assert.equal(
            validated.domain,
            "Crime"
        );


        assert.equal(
            validated.eventType,
            "Mass Shooting"
        );


        assert.equal(
            validated.suggestedCategory,
            "Violent Crime"
        );


        const factorNames =
            result.riskScore.factors.map(
                factor =>
                    factor.factor
            );


        assert.equal(
            factorNames.includes(
                "Terrorism Baseline"
            ),
            false
        );


        assert.equal(
            result.thresholdDecision.action,
            "SIGNAL"
        );


        assert.equal(
            result.overrideDecision.overridden,
            false
        );

    }
);
//==================================================
// 16. CRITICAL INFRASTRUCTURE — NON-CYBER CONTROL
//==================================================

test(
    "Critical infrastructure alone does not trigger cyber GLOBAL_URGENT rule",
    () => {

        const engine =
            new ThresholdEngine(
                thresholdMatrix
            );


        const decision =
            engine.evaluate(
                {

                    domain:
                        "Infrastructure",

                    eventType:
                        "Power Outage",

                    fatalities:
                        0,

                    injuries:
                        0,

                    infrastructureImpact:
                        "Moderate",

                    criticalInfrastructure: [
                        "Regional Power Grid"
                    ]

                },
                10
            );


        assert.equal(
            decision.action,
            "SIGNAL"
        );


        assert.equal(
            decision.ruleId,
            undefined
        );


        assert.equal(
            decision.source,
            "score-band"
        );

    }
);