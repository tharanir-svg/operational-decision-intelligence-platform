const PromptV2 = require("./PromptV2");
const ParserV2 = require("./ParserV2");
const ValidatorV2 = require("./ValidatorV2");

class ServiceV2 {

    constructor(geminiClient) {

        this.gemini = geminiClient;

        this.promptBuilder = new PromptV2();

        this.parser = new ParserV2();

        this.validator = new ValidatorV2();

    }

    async extract(evidence) {

        console.log("");
        console.log("======================================");
        console.log("ENTERPRISE EXTRACTION V2");
        console.log("======================================");

        //----------------------------------------------------
        // Build Prompt
        //----------------------------------------------------

        const prompt =
            this.promptBuilder.build(evidence);

        console.log("Prompt Built");

        //----------------------------------------------------
        // Gemini
        //----------------------------------------------------

        const ai =
            await this.gemini.generate(prompt);

        if (!ai.success) {

            throw new Error(ai.error);

        }

        console.log("Gemini Response Received");

        //----------------------------------------------------
        // Parse
        //----------------------------------------------------

        let intel =
            this.parser.parse(ai.text);

        console.log("Parser Complete");

        //----------------------------------------------------
        // Validate / Enrich
        //----------------------------------------------------

        intel =
            this.validator.validate(intel);

        console.log("Validation Complete");

        //----------------------------------------------------
        // Metadata
        //----------------------------------------------------

        intel.metadata = {

            engine: "Enterprise Extraction V2",

            model:
                ai.model || "Gemini",

            generatedAt:
                new Date().toISOString(),

            processingTime:
                ai.processingTime || 0

        };

        //----------------------------------------------------
        // Success
        //----------------------------------------------------

        return {

            success: true,

            intelligence: intel

        };

    }

}

module.exports = ServiceV2;