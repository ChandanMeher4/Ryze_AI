import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// This list must match your library imports
const ALLOWED_COMPONENTS = ["Button", "Card", "Navbar", "Sidebar", "Modal"];

export async function POST(req: Request) {
  try {
    const { userInput, currentCode } = await req.json();

    const prompt = `
You are a UI Planning Agent.
Return **valid JSON ONLY**. No markdown.

Allowed Components & Props:
1. **Button**: { label: string, variant: "primary" | "secondary" }
2. **Card**: { title: string, children: Component[] }
3. **Navbar**: { title: string }
4. **Sidebar**: { items: string[] }  <-- Array of strings only
5. **Modal**: { title: string, content: string }

**Rules:**
- Use "children" array ONLY for Card.
- Sidebar "items" must be a simple list of strings ["Home", "Settings"].
- Navbar only takes a "title".

Required Output Format:
{
  "layout": "dashboard",
  "components": [
    { "type": "Navbar", "props": { "title": "My App" } },
    { "type": "Card", "props": { "title": "Welcome" }, "children": [ { "type": "Button", "props": { "label": "Click Me" } } ] }
  ],
  "changes": "Summary of changes"
}

User Request: ${userInput}
Existing Code: ${currentCode || "None"}
`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // or llama3-70b-8192 if that failed
      messages: [
        { role: "system", content: "You return raw JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      max_completion_tokens: 1000,
    });

    const rawText = completion.choices[0]?.message?.content || "";

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error("JSON Error:", rawText);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 500 });
    }

    return NextResponse.json({ plan: parsed });
  } catch (error: any) {
    console.error("Planner Error:", error);
    return NextResponse.json({ error: "Planner Failed" }, { status: 500 });
  }
}
