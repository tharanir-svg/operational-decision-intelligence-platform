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

        this.model = "gemini-2.5-flash";
    }

    async generate(prompt) {

        console.log("Calling Gemini...");
        console.log("Model:", this.model);

        try {

            const response = await this.client.models.generateContent({

                model: this.model,

                contents: prompt

            });

            return {

                success: true,

                text: response.text,

                model: this.model,

                raw: response

            };

        } catch (error) {

            console.dir(error, { depth: null });

            throw error;

        }

    }

}

module.exports = GeminiClient;
