const IntelligenceParser =
require("../parsers/IntelligenceParser");
const GeminiClient = require("../ai/GeminiClient");
const buildExtractionPrompt = require("../prompts/ExtractionPrompt");
const ExtractionValidator = require("../validation/ExtractionValidator");

class AIExtractionService {

    constructor() {

        this.gemini = new GeminiClient();
        this.validator = new ExtractionValidator();

    }

    async extractEvidence(evidence) {
        console.log("===== AIExtractionService =====");
        console.log(evidence);
        const prompt = buildExtractionPrompt(evidence);

        const started = Date.now();
        console.log("Calling Gemini...");
        console.log(result);
        const result = await this.gemini.generate(prompt);

        if (!result.success) {

            throw new Error(result.error);

        }

        let intelligence;

        try {

            intelligence = this.parser.parse(result.text);

            intelligence = this.parser.normalize(intelligence);

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