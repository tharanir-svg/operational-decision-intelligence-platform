const GeminiClient = require("../ai/GeminiClient");
const buildExtractionPrompt = require("../prompts/ExtractionPrompt");
const ExtractionValidator = require("../validation/ExtractionValidator");

class AIExtractionService {

    constructor() {

        this.gemini = new GeminiClient();
        this.validator = new ExtractionValidator();

    }

    async extractEvidence(evidence) {

        const prompt = buildExtractionPrompt(evidence);

        const started = Date.now();

        const result = await this.gemini.generate(prompt);

        if (!result.success) {

            throw new Error(result.error);

        }

        let intelligence;

        try {

            intelligence = JSON.parse(result.text);

        }

        catch (err) {

            throw new Error(
                "Gemini returned invalid JSON.\n\n" +
                result.text
            );

        }

        this.validator.validate(intelligence);

        intelligence.model = result.model;
        intelligence.processingTime = result.latency;
        intelligence.timestamp = new Date().toISOString();

        return intelligence;

    }

}

module.exports = AIExtractionService;