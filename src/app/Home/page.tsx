"use client";

import { useState } from "react";
import { useGemini } from "../../../hook/AIApi";

export default function Home() {
  const [input, setInput] = useState("");
  const { ask, response, loading, error } = useGemini();

  const handleAsk = () => {
    console.log("Asking:", input);
    if (input.trim() !== "") {
      ask(input);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ask GPT</h1>
      <textarea
        className="w-full border p-2 rounded mb-2"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {response && (
        <div className="mt-4 border rounded p-4 bg-gray-50 whitespace-pre-wrap">
          {response}
        </div>
      )}
    </main>
  );
}
