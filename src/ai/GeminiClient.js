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


        this.apiKey =
            apiKey.trim();


        //==================================================
        // MODEL
        //
        // Vertex AI Express Mode.
        //==================================================

        this.model =
            process.env.GEMINI_MODEL ||
            "gemini-2.5-flash";


        //==================================================
        // VERTEX EXPRESS ENDPOINT
        //
        // Native REST is used instead of @google/genai.
        // This avoids SDK authentication incompatibility
        // inside the Cloudflare Workers runtime.
        //==================================================

        this.baseUrl =
            "https://aiplatform.googleapis.com/v1/publishers/google/models";

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
            // BUILD REQUEST URL
            //
            // Do not log this URL because it contains the API
            // key as a query parameter.
            //==================================================

            const url =
                new URL(
                    `${this.baseUrl}/${encodeURIComponent(this.model)}:generateContent`
                );


            url.searchParams.set(
                "key",
                this.apiKey
            );


            //==================================================
            // VERTEX EXPRESS REST REQUEST
            //==================================================

            const response =
                await fetch(
                    url.toString(),
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                contents: [

                                    {

                                        role:
                                            "user",

                                        parts: [

                                            {

                                                text:
                                                    prompt

                                            }

                                        ]

                                    }

                                ]

                            })

                    }
                );


            const processingTime =
                Date.now() -
                startedAt;


            //==================================================
            // PARSE RESPONSE
            //==================================================

            let data;


            try {

                data =
                    await response.json();

            }

            catch {

                throw new Error(
                    `Vertex AI returned an invalid response. HTTP ${response.status}.`
                );

            }


            //==================================================
            // HTTP / API ERROR
            //==================================================

            if (
                !response.ok
            ) {

                const apiMessage =
                    data?.error?.message ||
                    `Vertex AI request failed with HTTP ${response.status}.`;


                throw new Error(
                    apiMessage
                );

            }


            //==================================================
            // EXTRACT GENERATED TEXT
            //==================================================

            const candidates =
                Array.isArray(data?.candidates)
                    ? data.candidates
                    : [];


            if (
                candidates.length === 0
            ) {

                throw new Error(
                    "Vertex AI returned no candidates."
                );

            }


            const parts =
                Array.isArray(
                    candidates[0]?.content?.parts
                )
                    ? candidates[0].content.parts
                    : [];


            const text =
                parts
                    .map(
                        part =>
                            typeof part?.text === "string"
                                ? part.text
                                : ""
                    )
                    .join("")
                    .trim();


            if (
                !text
            ) {

                throw new Error(
                    "Vertex AI returned an empty text response."
                );

            }


            //==================================================
            // SAFE OPERATIONAL LOGGING
            //
            // Never log:
            // - API key
            // - request URL
            // - prompt/evidence
            // - raw model response
            //==================================================

            console.log(
                `[Gemini/VertexREST] response received | model=${this.model} | latency=${processingTime}ms`
            );


            //==================================================
            // SUCCESS
            //
            // Keep the same interface expected by ServiceV2.
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
                `[Gemini/VertexREST] request failed | model=${this.model} | latency=${processingTime}ms | ${error?.message || "Unknown error"}`
            );


            return {

                success:
                    false,

                error:
                    error?.message ||
                    "Vertex AI request failed.",

                model:
                    this.model,

                processingTime

            };

        }

    }

}


module.exports =
    GeminiClient;