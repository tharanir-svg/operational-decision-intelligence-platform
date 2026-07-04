module.exports = function buildExtractionPrompt(evidence) {
  return `
You are an Operational Intelligence Analyst.

Analyze the following operational evidence.

Evidence:
${evidence}

Return ONLY valid JSON.

{
  "summary":"",
  "eventType":"",
  "region":"",
  "domain":"",
  "severity":"",
  "fatalities":0,
  "injuries":0,
  "confidence":0,
  "keywords":[],
  "entities":[],
  "recommendedAction":"",
  "explanation":""
}
`;
};