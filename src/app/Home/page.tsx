"use client";

import { useState, useEffect } from "react";
import { useGemini } from "../../../hook/AIApi";
import CodeEditor from "../component/CodeEditor";

// Helper to parse markdown with multiple code blocks
function parseMarkdownWithCodeBlocks(markdown: string) {
  const pattern = /```(?:\w*\n)?([\s\S]*?)```/g;
  const parts: { type: "text" | "code"; content: string }[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(markdown)) !== null) {
    const index = match.index;
    const code = match[1].trim();

    if (index > lastIndex) {
      parts.push({
        type: "text",
        content: markdown.slice(lastIndex, index).trim(),
      });
    }

    parts.push({ type: "code", content: code });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < markdown.length) {
    parts.push({
      type: "text",
      content: markdown.slice(lastIndex).trim(),
    });
  }

  return parts;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [parsedResponse, setParsedResponse] = useState<
    { type: "text" | "code"; content: string }[]
  >([]);
  const { ask, response, loading, error } = useGemini();

  const handleAsk = () => {
    if (input.trim()) {
      ask(input);
    }
  };

  useEffect(() => {
    if (response) {
      console.log("AI Response:", response);
      const parts = parseMarkdownWithCodeBlocks(response);
      setParsedResponse(parts);
    }
  }, [response]);

  return (
    <main className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Test AI Web Builder</h1>

      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the web component you want..."
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking..." : "Generate"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-6 mt-6">
        {parsedResponse.map((part, index) =>
          part.type === "code" ? (
            <div key={index} className="border rounded bg-gray-100 p-2">
              <CodeEditor
                code={part.content}
                language="typescript"
                onChange={(updated) =>
                  console.log("Code updated at block", index, updated)
                }
              />
            </div>
          ) : (
            <p
              key={index}
              className="text-gray-800 whitespace-pre-line"
            >
              {part.content}
            </p>
          )
        )}
      </div>
    </main>
  );
}
