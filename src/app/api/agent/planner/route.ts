import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userInput, currentCode } = await req.json();

    const prompt = `
You are a strict UI Planning Agent.
Return valid JSON only.
No markdown.
No explanation.

Format:
{
  "layout": "string",
  "components": [
    { "type": "ComponentName", "props": {} }
  ],
  "changes": "string"
}

User Request:
${userInput}

Existing Code:
${currentCode || "None"}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You return strict raw JSON only. No markdown. No explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
      max_completion_tokens: 600,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Groq" },
        { status: 500 },
      );
    }

    return NextResponse.json({ plan: text });
  } catch (error: any) {
    console.error("Planner error:", error);

    return NextResponse.json(
      { error: error.message || "Planner failed" },
      { status: 500 },
    );
  }
}

console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);
console.log("GROQ KEY LENGTH:", process.env.GROQ_API_KEY?.length);
