const GeminiClient = require("../ai/GeminiClient");
const buildExtractionPrompt = require("../prompts/ExtractionPrompt");
const ExtractionValidator = require("../validation/ExtractionValidator");
const IntelligenceParser = require("../parsers/IntelligenceParser");
const EntityExtractor = require("../intelligence/EntityExtractor");

class AIExtractionService {

    constructor() {

        this.gemini = new GeminiClient();
        this.validator = new ExtractionValidator();
        this.parser = new IntelligenceParser();
        this.entityExtractor = new EntityExtractor();

    }

    async extractEvidence(evidence) {

        const prompt = buildExtractionPrompt(evidence);

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

        intelligence.extractedEntities =
            this.entityExtractor.extract(intelligence);

        return intelligence;

    }

}

module.exports = AIExtractionService;