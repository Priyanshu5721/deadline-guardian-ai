import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task } = body;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      Analyze this task:

      ${task}

      Give:
      1. Priority (High/Medium/Low)
      2. Difficulty (Easy/Medium/Hard)
      3. Estimated Hours
      4. Urgency
      `,
    });

    return Response.json({
      result: response.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}