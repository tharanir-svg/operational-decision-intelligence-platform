const GeminiClient = require("../ai/GeminiClient");
const buildExtractionPrompt = require("../prompts/ExtractionPrompt");
const ExtractionValidator = require("../validation/ExtractionValidator");
const IntelligenceParser = require("../parsers/IntelligenceParser");
const EntityExtractor = require("../intelligence/EntityExtractor");
const ConfidenceEngine = require("../scoring/ConfidenceEngine");
const KnowledgeExtractor = require("../intelligence/KnowledgeExtractor");

class AIExtractionService {

    constructor() {

        this.gemini = new GeminiClient();

        this.validator = new ExtractionValidator();

        this.parser = new IntelligenceParser();

        this.entityExtractor = new EntityExtractor();

        this.confidenceEngine = new ConfidenceEngine();

        this.knowledgeExtractor = new KnowledgeExtractor();

    }

    async extractEvidence(evidence) {

        console.log("================================");
        console.log("AIExtractionService EXECUTING");
        console.log("================================");

        console.log("Evidence:");
        console.log(evidence);

        // Build prompt
        const prompt = buildExtractionPrompt(evidence);

        console.log("Sending prompt to Gemini...");

        // Call Gemini
        const response = await this.gemini.generate(prompt);

        if (!response.success) {
            throw new Error(response.error);
        }

        console.log("Gemini Response:");
        console.log(response.text);

        // Parse JSON
        let parsed = this.parser.parse(response.text);

        // Normalize fields
        parsed = this.parser.normalize(parsed);

        // Validate required fields
        this.validator.validate(parsed);

        // Extract entities if available
        if (this.entityExtractor &&
            typeof this.entityExtractor.extract === "function") {

            parsed.entities =
                this.entityExtractor.extract(parsed);
        }

        // Confidence scoring if available
        if (this.confidenceEngine &&
            typeof this.confidenceEngine.score === "function") {

            parsed.confidenceAssessment =
                this.confidenceEngine.score(parsed);
        }

        // Knowledge extraction if available
        if (this.knowledgeExtractor &&
            typeof this.knowledgeExtractor.extract === "function") {

            parsed.knowledge =
                this.knowledgeExtractor.extract(parsed);
        }

        parsed.processingTime = 0;
        parsed.timestamp = new Date().toISOString();

        return parsed;

    }

}

module.exports = AIExtractionService;
