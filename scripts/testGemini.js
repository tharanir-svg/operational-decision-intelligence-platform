const { GoogleGenAI } = require("@google/genai");

async function main() {

    const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    console.log("API Key Found:", !!process.env.GEMINI_API_KEY);

    const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Reply with exactly: Hello from Gemini"
    });

    console.log("================================");
    console.log(response.text);
    console.log("================================");
}

main().catch(err => {
    console.error("FULL ERROR:");
    console.dir(err, { depth: null });
});