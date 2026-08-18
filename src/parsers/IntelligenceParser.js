class IntelligenceParser {

    parse(aiResponse) {

        if (!aiResponse) {
            throw new Error("Empty AI response.");
        }

        // Already parsed object
        if (typeof aiResponse !== "string") {
            return this.normalize(aiResponse);
        }

        let text = aiResponse.trim();

        // Remove markdown fences
        text = text
            .replace(/^```json/i, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();

        // First attempt
        try {
            return this.normalize(JSON.parse(text));
        }
        catch (e) {

            console.log("Direct JSON parse failed.");

        }

        // Second attempt
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start !== -1 && end !== -1 && end > start) {

            const jsonText = text.substring(start, end + 1);

            try {

                return this.normalize(JSON.parse(jsonText));

            }
            catch (e) {

                console.log("Embedded JSON parse failed.");

            }

        }

        // Last resort
        console.log("RAW AI RESPONSE");
        console.log(text);

        throw new Error(
            "AI did not return valid JSON."
        );

    }

    normalize(data) {

        return {

            summary: data.summary || "",

            eventType: data.eventType || "Unknown",

            domain: data.domain || "Unknown",

            country: data.country || "",

            region: data.region || "",

            location: data.location || "",

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