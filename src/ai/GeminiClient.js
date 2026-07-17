const { GoogleGenAI } = require("@google/genai");

console.log("✅ GeminiClient loaded");

class GeminiClient {

    constructor() {

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing.");
        }

        this.client = new GoogleGenAI({
            apiKey
        });

        this.model = "gemini-3.1-flash-lite";

        console.log(">>> USING MODEL:", this.model);
    }

    async generate(prompt) {

        console.log("==========================================");
        console.log("ENTERED GeminiClient.generate()");
        console.log("MODEL:", this.model);
        console.log("Prompt length:", prompt.length);
        console.log("==========================================");

        try {

            const response = await this.client.models.generateContent({

                model: this.model,

                contents: prompt

            });

            console.log("==========================================");
            console.log("GEMINI RAW RESPONSE");
            console.dir(response, { depth: null });
            console.log("==========================================");

            if (!response) {
                throw new Error("Gemini returned no response.");
            }

            if (!response.text) {
                throw new Error("Gemini returned an empty text response.");
            }

            return {
                success: true,
                text: response.text,
                model: this.model,
                latency: 0,
                raw: response
            };

        } catch (error) {

            console.log("==========================================");
            console.log("GEMINI ERROR");
            console.dir(error, { depth: null });
            console.log("==========================================");

            return {
                success: false,
                error: error.message,
                model: this.model
            };
        }
    }
}

module.exports = GeminiClient;