import { useState } from "react";

export function useGemini() {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanedPrompt, setCleanedPrompt] = useState<string | null>(null);

  const clean = async (rawPrompt: string): Promise<string> => {
    try {
      const res = await fetch("/api/clean_prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: rawPrompt }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      const cleaned = data.result; // Changed from data.cleanedPrompt to data.result
      setCleanedPrompt(cleaned);
      return cleaned; // Return the cleaned prompt
    } catch (err: any) {
      setError("Prompt cleaning failed: " + (err.message || "Unknown error"));
      return rawPrompt; // fallback: use original if cleaning fails
    }
  }

  const ask = async (rawPrompt: string) => {
    setLoading(true);
    setError(null);

    try {
      const prompt = await clean(rawPrompt);
      const res = await fetch("/api/ask_ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setResponse(data.result);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { ask, response, loading, error, cleanedPrompt };
}