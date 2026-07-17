module.exports = function buildExtractionPrompt(evidence) {

    const text = evidence?.text || "";
    const url = evidence?.url || "";
    const images = Array.isArray(evidence?.images)
        ? evidence.images.join(", ")
        : "";
    const videos = Array.isArray(evidence?.videos)
        ? evidence.videos.join(", ")
        : "";

    return `
You are a senior Operational Intelligence Analyst.

Your task is to extract structured operational intelligence.

Evidence Text:
${text}

Source URL:
${url}

Images:
${images}

Videos:
${videos}

Return ONLY valid JSON.

Do NOT include markdown.

Do NOT explain anything.

Use exactly this schema:

{
  "summary":"",
  "eventType":"",
  "region":"",
  "country":"",
  "location":"",
  "domain":"",
  "confidence":0,
  "fatalities":0,
  "injuries":0,
  "keywords":[],
  "entities":[],
  "recommendedAction":"",
  "explanation":""
}
`;
};