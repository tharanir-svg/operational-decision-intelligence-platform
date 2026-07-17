const { GoogleGenAI } = require("@google/genai");

async function test(model) {
  try {
    console.log(`\nTesting: ${model}`);

    const client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await client.models.generateContent({
      model,
      contents: "Reply with exactly: OK"
    });

    console.log("SUCCESS:", response.text);
  } catch (err) {
    console.log("FAILED:", model);
    console.log(err.message);
  }
}

(async () => {
  await test("gemini-2.5-pro");
  await test("gemini-3-flash");
  await test("gemini-3-pro");
  await test("gemini-3.1-flash");
  await test("gemini-3.1-flash-lite");
})();