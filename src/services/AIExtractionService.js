const GeminiClient = require("../ai/GeminiClient");
const buildExtractionPrompt = require("../prompts/ExtractionPrompt");
const ExtractionValidator = require("../validation/ExtractionValidator");
const IntelligenceParser = require("../parsers/IntelligenceParser");

const EntityExtractor = require("../intelligence/EntityExtractor");
const TaxonomyMatcher = require("../intelligence/TaxonomyMatcher");
const KnowledgeEnricher = require("../intelligence/KnowledgeEnricher");
const KnowledgeExtractor = require("../intelligence/KnowledgeExtractor");

const ConfidenceEngine = require("../scoring/ConfidenceEngine");

class AIExtractionService {

    constructor() {

        this.gemini = new GeminiClient();

        this.validator = new ExtractionValidator();

        this.parser = new IntelligenceParser();

        this.entityExtractor = new EntityExtractor();

        this.taxonomyMatcher = new TaxonomyMatcher();

        this.knowledgeEnricher = new KnowledgeEnricher();

        this.confidenceEngine = new ConfidenceEngine();

        this.knowledgeExtractor = new KnowledgeExtractor();

    }

    async extractEvidence(evidence) {

        console.log("====================================");
        console.log("AI EXTRACTION SERVICE");
        console.log("====================================");

        console.log("========== EVIDENCE RECEIVED ==========");
        console.dir(evidence, { depth: null });

        //------------------------------------------
        // Build Prompt
        //------------------------------------------

        const prompt = buildExtractionPrompt(evidence);

        console.log("========== GENERATED PROMPT ==========");
        console.log(prompt);
        console.log("======================================");

        const started = Date.now();

        //------------------------------------------
        // Gemini
        //------------------------------------------

        const result = await this.gemini.generate(prompt);

        console.log("====================================");
        console.log("RAW GEMINI RESPONSE");
        console.log("====================================");
        console.dir(result, { depth: null });

        if (!result.success) {

            throw new Error(result.error);

        }

        console.log("====================================");
        console.log("RAW GEMINI TEXT");
        console.log("====================================");
        console.log(result.text);

        //------------------------------------------
        // Parse
        //------------------------------------------

        let intelligence = this.parser.parse(result.text);

        console.log("====================================");
        console.log("PARSED INTELLIGENCE");
        console.log("====================================");
        console.dir(intelligence, { depth: null });

        //------------------------------------------
        // Validate
        //------------------------------------------

        this.validator.validate(intelligence);

        //------------------------------------------
        // Normalize against Enterprise Taxonomy
        //------------------------------------------

        //------------------------------------------
// Normalize against Enterprise Taxonomy
//------------------------------------------

        console.log("\n========== BEFORE TAXONOMY MATCH ==========");
        console.dir(intelligence, { depth: null });

        const taxonomy =
            this.taxonomyMatcher.match(intelligence);

        console.log("\n========== AFTER TAXONOMY MATCH ==========");
        console.dir(taxonomy, { depth: null });

/*
 * IMPORTANT:
 * Keep all AI extracted fields.
 * Attach taxonomy matches instead of replacing them.
 */
intelligence = {

    ...intelligence,

    taxonomy,

    // Replace only classification fields with normalized versions
    region: taxonomy.region,
    country: taxonomy.country,
    domain: taxonomy.domain,
    eventType: taxonomy.eventType,

    threatActor: taxonomy.threatActor,
    criticalSector: taxonomy.criticalSector,
    infrastructure: taxonomy.infrastructure,
    organization: taxonomy.organization,

    taxonomySummary: taxonomy.summary

};

        console.log("====================================");
        console.log("MERGED INTELLIGENCE");
        console.log("====================================");
        console.dir(intelligence, { depth: null });
        //------------------------------------------
        // Knowledge Enrichment
        //------------------------------------------

        const enrichment =
            this.knowledgeEnricher.enrich(
                intelligence
    );

        intelligence.enrichment =
            enrichment;

        console.log(
            "===================================="
);

        console.log(
            "KNOWLEDGE ENRICHMENT"
);

        console.log(
            "===================================="
);

        console.dir(
            enrichment,
            { depth: null }
);
        //------------------------------------------
        // Entity Extraction
        //------------------------------------------

        intelligence.entities =
            this.entityExtractor.extract(intelligence);

        console.log("====================================");
        console.log("ENTITY EXTRACTION");
        console.log("====================================");
        console.dir(intelligence.entities, { depth: null });

        //------------------------------------------
        // Confidence Assessment
        //------------------------------------------

        intelligence.confidenceAssessment =
            this.confidenceEngine.calculate(intelligence);

        console.log("====================================");
        console.log("CONFIDENCE");
        console.log("====================================");
        console.dir(intelligence.confidenceAssessment, {
            depth: null
        });

        //------------------------------------------
        // Knowledge Extraction
        //------------------------------------------

        intelligence.knowledge =
            this.knowledgeExtractor.extract(intelligence);

        console.log("====================================");
        console.log("KNOWLEDGE");
        console.log("====================================");
        console.dir(intelligence.knowledge, {
            depth: null
        });

        //------------------------------------------
        // Metadata
        //------------------------------------------

        intelligence.model = result.model;

        intelligence.processingTime =
            Date.now() - started;

        intelligence.timestamp =
            new Date().toISOString();

        //------------------------------------------
        // Completed
        //------------------------------------------

        console.log("====================================");
        console.log("FINAL INTELLIGENCE");
        console.log("====================================");

        console.dir(intelligence, {
            depth: null
        });

        console.log("Extraction completed successfully.");

        return intelligence;

    }

}

module.exports = AIExtractionService;