import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI({ apiKey: "AIzaSyDFAt5HhPBn7Pgqt_bID1TYyovK1z7Isyw" });
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Try a basic model

async function main() {
  try {
    const result = await model.generateContent("Test prompt");
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();