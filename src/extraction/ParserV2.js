class ParserV2 {

    parse(rawText) {

        if (!rawText) {
            throw new Error("Empty AI response.");
        }

        let text = String(rawText).trim();

        // ---------------------------------------
        // Remove Markdown code fences
        // ---------------------------------------

        text = text
            .replace(/^```json/i, "")
            .replace(/^```/i, "")
            .replace(/```$/i, "")
            .trim();

        let parsed;

        try {

            parsed = JSON.parse(text);

        } catch (err) {

            console.error("ParserV2 JSON Error");
            console.error(text);

            throw new Error("Gemini returned invalid JSON.");

        }

        return this.normalize(parsed);

    }

    normalize(data = {}) {

        return {

            summary:
                this.str(data.summary),

            eventType:
                this.str(data.eventType),

            domain:
                this.str(data.domain),

            region:
                this.str(data.region),

            country:
                this.str(data.country),

            city:
                this.str(data.city),

            confidence:
                this.num(data.confidence),

            casualties: {

                fatalities:
                    this.num(data.casualties?.fatalities),

                injuries:
                    this.num(data.casualties?.injuries)

            },

            crowdSize:
                this.num(data.crowdSize),

            infrastructureImpact:
                this.str(data.infrastructureImpact || "None"),

            threatIndicators:
                this.array(data.threatIndicators),

            weapons:
                this.array(data.weapons),

            criticalInfrastructure:
                this.array(data.criticalInfrastructure),

            organizations:
                this.array(data.organizations),

            persons:
                this.array(data.persons),

            reasoning:
                this.str(data.reasoning),

            suggestedThreshold:
                this.str(data.suggestedThreshold),

            suggestedCategory:
                this.str(data.suggestedCategory),

            recommendedActions:
                this.array(data.recommendedActions),

            originalText:
                this.str(data.originalText)

        };

    }

    //-------------------------------------

    str(value) {

        if (value === null || value === undefined)
            return "";

        if (typeof value === "object")
            return JSON.stringify(value);

        return String(value).trim();

    }

    //-------------------------------------

    num(value) {

        const n = Number(value);

        if (Number.isNaN(n))
            return 0;

        return n;

    }

    //-------------------------------------

    array(value) {

        if (!value)
            return [];

        if (Array.isArray(value))
            return value;

        return [value];

    }

}

module.exports = ParserV2;