// src/app/api/ask-gemini/route.ts

import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyA0jP1jSRC2N_H0KQhQlPRGu1Zo2OioJr0"; // your Gemini key here

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 500 });
  }

  const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  return NextResponse.json({ result });
}
