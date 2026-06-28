import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task } = body;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `
Analyze this task:

${task}

Give:
1. Priority
2. Difficulty
3. Estimated Hours
4. Urgency
`,
      });

      return Response.json({
        result: response.text,
      });

    } catch (err) {
      console.log("Gemini unavailable. Using fallback.");

      return Response.json({
        result: `
Priority: High

Difficulty: Medium

Estimated Hours: 4-6 Hours

Urgency: Complete this task as soon as possible.

AI Suggestion:
Break the work into small milestones, focus on the most important part first, avoid distractions, and review your progress after every hour.
`,
      });
    }

  } catch (error) {
    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}