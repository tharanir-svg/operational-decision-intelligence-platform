const { GoogleGenAI } = require("@google/genai");

class GeminiClient {

    constructor() {

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing.");
        }

        this.client = new GoogleGenAI({
            apiKey
        });

        this.model = "gemini-2.5-flash";
    }

    async generate(prompt) {

        const started = Date.now();

        try {

            const response = await this.client.models.generateContent({

                model: this.model,

                contents: prompt

            });

            const elapsed = Date.now() - started;

            return {

                success: true,

                text: response.text,

                model: this.model,

                latency: elapsed,

                raw: response

            };

        }

        catch (error) {

            return {

                success: false,

                error: error.message,

                model: this.model

            };

        }

    }

}

module.exports = GeminiClient;