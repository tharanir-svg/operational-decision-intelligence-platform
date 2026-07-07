class IntelligenceParser {

    parse(aiResponse) {

        if (typeof aiResponse === "string") {

            aiResponse = aiResponse.trim();

            aiResponse = aiResponse
                .replace(/^```json/, "")
                .replace(/^```/, "")
                .replace(/```$/, "")
                .trim();

            return JSON.parse(aiResponse);
        }

        return aiResponse;
    }

    normalize(data) {

        return {

            summary: data.summary || "",

            eventType: data.eventType || "Unknown",

            region: data.region || "Unknown",

            country: data.country || "",

            location: data.location || "",

            domain: data.domain || "Unknown",

            confidence: Number(data.confidence || 0),

            fatalities: Number(data.fatalities || 0),

            injuries: Number(data.injuries || 0),

            keywords: Array.isArray(data.keywords)
                ? data.keywords
                : [],

            entities: Array.isArray(data.entities)
                ? data.entities
                : [],

            explanation: data.explanation || "",

            recommendedAction:
                data.recommendedAction || "",

            timestamp:
                new Date().toISOString()

        };

    }

}

module.exports = IntelligenceParser;