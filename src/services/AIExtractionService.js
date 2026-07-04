const GeminiClient = require("../ai/GeminiClient");
const ExtractionPrompt = require("../prompts/ExtractionPrompt");

class AIExtractionService {

    constructor() {

        this.gemini = new GeminiClient();

    }

    async extract(evidence) {

        try {

            const prompt = ExtractionPrompt.build(evidence);

            const result = await this.gemini.generate(prompt);

            if (!result.success) {

                throw new Error(result.error);

            }

            return {

                success: true,

                extraction: result.text,

                metadata: {

                    model: result.model,

                    latency: result.latency

                }

            };

        }

        catch (err) {

            return {

                success: false,

                error: err.message

            };

        }

    }

}

module.exports = AIExtractionService;
