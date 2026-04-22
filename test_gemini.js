import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    const result = await model.generateContent(
      'Return valid JSON only: {"status":"ok"}'
    );

    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

test();