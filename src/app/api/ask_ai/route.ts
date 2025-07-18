import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyA0jP1jSRC2N_H0KQhQlPRGu1Zo2OioJr0";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    // Validate input
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

        const systemInstruction = `
        Create a tutorial-style website scaffold for a donut shop using Next.js + Tailwind. Output should include:

            Setup instructions

            Tailwind config

            Pages structure (index, menu, about, contact)

            Sample data in code

            Deployment suggestion

        Format as:

            Markdown-style explanation

            Code blocks for each file

            Use clean indentation and clear language

        Output only the code and instructions. Dont explain yourself
    `;

    const fullPrompt = `${systemInstruction}\n\nUser prompt:\n${prompt}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ]
    };

    console.log("Sending request to Gemini:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("Gemini response status:", response.status);

    const data = await response.json();
    console.log("Gemini response data:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("Gemini API error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return NextResponse.json({ result });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ 
      error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error")
    }, { status: 500 });
  }
}