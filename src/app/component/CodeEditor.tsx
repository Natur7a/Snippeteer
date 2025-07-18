"use client";

import Editor from "@monaco-editor/react";

type CodeEditorProps = {
  code: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
};

export default function CodeEditor({ code, language = "javascript", onChange }: CodeEditorProps) {
  return (
    <div className="border rounded-xl shadow-md overflow-hidden">
      <Editor
        height="400px"
        defaultLanguage={language}
        defaultValue={code}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
