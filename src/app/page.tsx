"use client";

import { useState } from "react";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [currentSchema, setCurrentSchema] = useState<any[]>([]);

  const handleGenerate = async () => {
    const res = await fetch("/api/agent/planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userInput: chatInput,
        currentCode: generatedCode,
      }),
    });

    const data = await res.json();

    if (data.plan) {
      // set code for middle panel
      setGeneratedCode(JSON.stringify(data.plan, null, 2));

      // set live preview for right panel
      setCurrentSchema(data.plan.components || []);
      setExplanation(data.plan.changes || "");
    } else {
      console.error("Planner returned error:", data.error);
    }
  };

  return (
    <main className="flex h-screen">
      {/* LEFT PANEL - CHAT */}
      <div className="w-1/3 border-r p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">AI Agent</h2>

        <div className="flex-1 border p-3 mb-4 bg-gray-50 rounded">
          {explanation || "Explainable output will appear here."}
        </div>

        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="border p-2 rounded mb-3"
          placeholder="Describe your UI..."
        />

        <button
          onClick={handleGenerate}
          className="bg-black text-white py-2 rounded"
        >
          Generate UI
        </button>
      </div>

      {/* MIDDLE PANEL - CODE */}
      <div className="w-1/3 border-r p-4 bg-gray-900 text-green-400 font-mono text-sm">
        <h2 className="text-white mb-4">Generated React Code</h2>

        <pre className="whitespace-pre-wrap">
          {generatedCode || "// Code will appear here"}
        </pre>
      </div>

      {/* RIGHT PANEL - PREVIEW */}
      <div className="w-1/2 p-8 overflow-auto flex items-center justify-center bg-slate-200">
        <div className="w-full max-w-md space-y-4">
          {currentSchema.map((item, i) => {
            const Component = COMPONENT_REGISTRY[item.type];
            return Component ? <Component key={i} {...item.props} /> : null;
          })}
        </div>
      </div>
    </main>
  );
}
