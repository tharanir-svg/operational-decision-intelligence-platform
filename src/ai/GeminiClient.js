const {
    GoogleGenAI
} = require("@google/genai");


class GeminiClient {

    constructor() {

        //==================================================
        // API KEY
        //==================================================

        const apiKey =
            process.env.GEMINI_API_KEY;


        if (
            !apiKey ||
            !apiKey.trim()
        ) {

            throw new Error(
                "GEMINI_API_KEY is missing."
            );

        }


        //==================================================
        // CLIENT
        //==================================================

        this.client =
            new GoogleGenAI({
                apiKey
            });


        //==================================================
        // MODEL
        //
        // Allow deployment environments to override the
        // model without requiring a code change.
        //==================================================

        this.model =
            process.env.GEMINI_MODEL ||
            "gemini-3.1-flash-lite";

    }


    async generate(prompt) {

        //==================================================
        // INPUT VALIDATION
        //==================================================

        if (
            typeof prompt !== "string" ||
            !prompt.trim()
        ) {

            return {

                success: false,

                error:
                    "Prompt is required.",

                model:
                    this.model,

                processingTime:
                    0

            };

        }


        const startedAt =
            Date.now();


        try {

            //==================================================
            // GEMINI REQUEST
            //==================================================

            const response =
                await this.client.models.generateContent({

                    model:
                        this.model,

                    contents:
                        prompt

                });


            const processingTime =
                Date.now() -
                startedAt;


            //==================================================
            // RESPONSE VALIDATION
            //==================================================

            if (
                !response
            ) {

                throw new Error(
                    "Gemini returned no response."
                );

            }


            const text =
                typeof response.text === "string"
                    ? response.text.trim()
                    : "";


            if (
                !text
            ) {

                throw new Error(
                    "Gemini returned an empty text response."
                );

            }


            //==================================================
            // SAFE OPERATIONAL LOGGING
            //
            // Do NOT print prompts, evidence, raw responses,
            // API keys or incident content.
            //==================================================

            console.log(
                `[Gemini] response received | model=${this.model} | latency=${processingTime}ms`
            );


            //==================================================
            // SUCCESS
            //==================================================

            return {

                success:
                    true,

                text,

                model:
                    this.model,

                processingTime

            };

        }

        catch (error) {

            const processingTime =
                Date.now() -
                startedAt;


            //==================================================
            // SAFE ERROR LOGGING
            //==================================================

            console.error(
                `[Gemini] request failed | model=${this.model} | latency=${processingTime}ms | ${error?.message || "Unknown error"}`
            );


            return {

                success:
                    false,

                error:
                    error?.message ||
                    "Gemini request failed.",

                model:
                    this.model,

                processingTime

            };

        }

    }

}


module.exports =
    GeminiClient;