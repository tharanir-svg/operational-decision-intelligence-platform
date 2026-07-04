const { GoogleGenAI } = require("@google/genai");

class GeminiClient {

    constructor() {

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing GEMINI_API_KEY environment variable.");
        }

        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        this.model = "gemini-2.5-flash";
    }

    async generate(prompt) {

        try {

            const response = await this.ai.models.generateContent({

                model: this.model,

                contents: prompt

            });

            if (
                !response ||
                !response.text
            ) {

                throw new Error("Gemini returned an empty response.");

            }

            return response.text;

        } catch (err) {

            console.error("Gemini Error:", err.message);

            throw err;

        }

    }

}

module.exports = GeminiClient;
