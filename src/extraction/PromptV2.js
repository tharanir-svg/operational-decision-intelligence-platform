class PromptV2 {

    build(evidence) {

        return `
You are an Operational Intelligence AI.

Extract intelligence from the evidence below.

Return ONLY valid JSON.

Schema:

{
  "summary":"",
  "eventType":"",
  "domain":"",
  "region":"",
  "country":"",
  "city":"",
  "confidence":0,

  "casualties":{
      "fatalities":0,
      "injuries":0
  },

  "crowdSize":0,

  "infrastructureImpact":"None",

  "threatIndicators":[],

  "weapons":[],

  "criticalInfrastructure":[],

  "organizations":[],

  "persons":[],

  "reasoning":"",

  "suggestedThreshold":"",

  "suggestedCategory":"",

  "recommendedActions":[],

  "originalText":""
}

Rules:

- Never return markdown.
- Never explain.
- Never wrap inside triple backticks.
- Return JSON only.

Evidence:

${evidence}
`;

    }

}

module.exports = PromptV2;