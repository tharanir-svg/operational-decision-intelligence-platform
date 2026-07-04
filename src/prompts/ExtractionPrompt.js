class ExtractionPrompt {

    static build(evidence) {

        return `
You are an Operational Intelligence analyst.

Analyze the evidence below.

Extract ONLY factual information.

Do NOT guess.

Return STRICT JSON.

Schema:

{
  "eventType":"",
  "region":"",
  "domain":"",
  "fatalities":0,
  "injuries":0,
  "confidence":0,
  "summary":"",
  "entities":[],
  "locations":[],
  "threatIndicators":[],
  "riskFactors":[],
  "recommendedSeverity":""
}

Evidence:

${evidence}

Return JSON only.
`;

    }

}

module.exports = ExtractionPrompt;
