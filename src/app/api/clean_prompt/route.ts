import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyA0jP1jSRC2N_H0KQhQlPRGu1Zo2OioJr0";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    console.log("Received prompt:", prompt);

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemInstruction = `
        You are a prompt-cleaning assistant for a website code generator.
        Take vague or messy user inputs and turn them into clear, structured prompts for generating websites with Next.js and Tailwind CSS.
        Include project type, structure, color themes, and style if mentioned.
        Respond only with the cleaned prompt — no extra explanation.
    `;

    const fullPrompt = `${systemInstruction}\n\nUser prompt:\n${prompt}`;

    console.log("Full prompt for Gemini:", fullPrompt);

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

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