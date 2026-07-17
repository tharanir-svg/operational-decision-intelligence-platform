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

        console.log("====================================");
        console.log("AI EXTRACTION SERVICE");
        console.log("====================================");

        console.log("========== EVIDENCE RECEIVED ==========");
        console.dir(evidence, { depth: null });

        const prompt = buildExtractionPrompt(evidence);

        console.log("========== GENERATED PROMPT ==========");
        console.log(prompt);
        console.log("======================================");

        console.log("Prompt created.");

        const started = Date.now();

        const result = await this.gemini.generate(prompt);

        console.log("====================================");
        console.log("RAW GEMINI RESPONSE");
        console.log("====================================");
        console.dir(result, { depth: null });

        console.log("====================================");
        console.log("RAW GEMINI TEXT");
        console.log(result.text);
        console.log("====================================");

        if (!result.success) {
            throw new Error(result.error);
        }

        const intelligence = this.parser.parse(result.text);

        this.validator.validate(intelligence);

        intelligence.entities =
            this.entityExtractor.extract(intelligence);

        intelligence.confidenceAssessment =
            this.confidenceEngine.calculate(intelligence);

        intelligence.knowledge =
            this.knowledgeExtractor.extract(intelligence);

        intelligence.model = result.model;
        intelligence.processingTime = Date.now() - started;
        intelligence.timestamp = new Date().toISOString();

        console.log("Extraction complete.");

        return intelligence;
    }
}

module.exports = AIExtractionService;