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

        this.model = "gemini-3.5-flash";
    }

    async generate(prompt) {

        console.log(">>> ENTERED GeminiClient.generate()");
        console.log("Model:", this.model);

        try {

            // Ignore the supplied prompt temporarily
            // and use the same prompt that worked in testGemini.js.
            console.log("=================================");
            console.log("MODEL USED:", this.model);
            console.log("=================================");
            const response = await this.client.models.generateContent({

                model: "gemini-3.5-flash",

                contents: "Reply with exactly: Hello from Gemini"

            });

            console.log("Response:");
            console.dir(response, { depth: null });

            return {

                success: true,

                text: response.text,

                model: "gemini-3.5-flash",

                latency: 0,

                raw: response

            };

        } catch (error) {

            console.log("FULL GEMINI ERROR");
            console.dir(error, { depth: null });

            return {

                success: false,

                error: error.message,

                model: "gemini-3.5-flash"

            };

        }

    }

}

module.exports = GeminiClient;