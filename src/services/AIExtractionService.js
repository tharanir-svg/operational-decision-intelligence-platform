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
        console.log("AIExtractionService IS EXECUTING");
        console.log("================================");

        console.log("Evidence received:");
        console.dir(evidence, { depth: null });

        // TEMPORARY TEST RESPONSE
        // Gemini is intentionally NOT called.
        // This allows us to verify whether this exact file is being executed.

        return {

            summary: "WORKING",

            eventType: "TEST",

            region: "TEST",

            domain: "TEST",

            severity: "LOW",

            fatalities: 0,

            injuries: 0,

            confidence: 100,

            keywords: [],

            entities: [],

            recommendedAction: "NONE",

            explanation: "This response is hardcoded from AIExtractionService.",

            model: "NONE",

            processingTime: 0,

            timestamp: new Date().toISOString(),

            confidenceAssessment: {
                score: 100,
                level: "HIGH"
            },

            knowledge: {
                entities: [],
                relationships: []
            }

        };

    }

}

module.exports = AIExtractionService;