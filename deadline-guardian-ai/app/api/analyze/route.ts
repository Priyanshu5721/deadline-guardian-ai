import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task } = body;

    try {
      // 🔥 Try Gemini AI first
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
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
    } catch (err) {
      // ⚡ Smart fallback (NO API dependency)
      console.log("Gemini unavailable. Using smart fallback.");

      const text = task.toLowerCase();

      let priority = "Medium";
      let difficulty = "Medium";
      let hours = "2-3 Hours";
      let urgency = "Normal";

      // 🔍 Keyword-based intelligence
      if (
        text.includes("urgent") ||
        text.includes("tomorrow") ||
        text.includes("asap") ||
        text.includes("due")
      ) {
        priority = "High";
        urgency = "High";
        hours = "4-6 Hours";
      }

      if (
        text.includes("assignment") ||
        text.includes("project") ||
        text.includes("exam")
      ) {
        difficulty = "Hard";
        hours = "6-10 Hours";
      }

      if (
        text.includes("buy") ||
        text.includes("shop") ||
        text.includes("groceries") ||
        text.includes("small") ||
        text.includes("quick")
      ) {
        priority = "Low";
        difficulty = "Easy";
        hours = "30-60 Minutes";
        urgency = "Low";
      }

      return Response.json({
        result: `
Priority: ${priority}

Difficulty: ${difficulty}

Estimated Hours: ${hours}

Urgency: ${urgency}

AI Suggestion:
Break the task into smaller steps, prioritize the most important parts first, avoid distractions, and track progress consistently.
        `,
      });
    }
  } catch (error) {
    return Response.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}