const { GoogleGenAI } = require("@google/genai");

async function main() {

    const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const models = await client.models.list();

    for await (const model of models) {
        console.log(model.name);
    }

}

main().catch(console.error);