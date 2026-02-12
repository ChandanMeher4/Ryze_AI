"use client";

import { useState } from "react";
import {
  Send,
  Terminal,
  LayoutTemplate,
  Undo,
  Redo,
  History,
} from "lucide-react";
import { generateReactCode } from "@/lib/generator";
import { Button, Card, Navbar, Sidebar, Modal } from "@/components/library";

const COMPONENT_REGISTRY: Record<string, React.FC<any>> = {
  Button,
  Card,
  Navbar,
  Sidebar,
  Modal,
};

export type ComponentSchema = {
  type: keyof typeof COMPONENT_REGISTRY;
  props: Record<string, any>;
  children?: ComponentSchema[];
};

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const currentVersion = currentIndex >= 0 ? history[currentIndex] : null;
  const generatedCode = currentVersion?.code || "";
  const currentSchema: ComponentSchema[] = currentVersion?.schema || [];
  const explanation = currentVersion?.explanation || "";

  const handleGenerate = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/agent/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: chatInput, currentCode: generatedCode }),
      });

      const data = await res.json();
      if (data.plan) {
        const jsxCode = generateReactCode(data.plan);

        const newVersion = {
          schema: data.plan.components || [],
          code: jsxCode,
          explanation: data.plan.changes || "UI Updated successfully.",
          timestamp: new Date().toLocaleTimeString(),
        };

        const newHistory = [...history.slice(0, currentIndex + 1), newVersion];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
        setChatInput("");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate UI. See console.");
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const handleRedo = () =>
    currentIndex < history.length - 1 && setCurrentIndex(currentIndex + 1);

  const renderComponent = (item: ComponentSchema, index: number) => {
    const Component = COMPONENT_REGISTRY[item.type];
    if (!Component) return null;
    const children = item.children?.map((child, i) => renderComponent(child, i));
    return (
      <Component key={index} {...item.props}>
        {children}
      </Component>
    );
  };

  return (
    <main className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* LEFT PANEL */}
      <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col shadow-sm z-10">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
            <Terminal size={18} /> Ryze Agent
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              title="Undo"
              onClick={handleUndo}
              disabled={currentIndex <= 0}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Undo size={18} />
            </button>
            <span className="text-xs text-gray-400 font-mono self-center">
              v{currentIndex + 1}/{history.length}
            </span>
            <button
              type="button"
              title="Redo"
              onClick={handleRedo}
              disabled={currentIndex >= history.length - 1}
              className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Redo size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {explanation ? (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-2 font-semibold text-blue-900">
                <History size={14} /> <span>Changes:</span>
              </div>
              {explanation}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm mt-10 italic">
              "Describe a UI..."
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 relative">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleGenerate()
            }
            className="w-full border p-3 pr-10 rounded-xl text-sm h-24 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="e.g. Add a refresh button to the card..."
          />
          <button
            type="button"
            title="Send message"
            onClick={handleGenerate}
            disabled={loading}
            className={`absolute bottom-8 right-5 p-2 rounded-lg text-white transition-all ${
              loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* MIDDLE PANEL */}
      <div className="w-1/3 border-r border-gray-700 bg-[#1e1e1e] text-green-400 flex flex-col">
        <div className="p-3 border-b border-gray-700 bg-[#252526] text-xs font-mono uppercase flex justify-between">
          <span>generated_ui.tsx</span>
          {currentIndex >= 0 && (
            <span className="text-gray-500">
              History: {history[currentIndex].timestamp}
            </span>
          )}
        </div>
        <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed">
          {generatedCode || "// AI Code will appear here..."}
        </pre>
      </div>

      {/* RIGHT PANEL: LIVE PREVIEW */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        <div className="p-3 border-b bg-white shadow-sm flex items-center gap-2 text-gray-500 text-sm">
          <LayoutTemplate size={16} /> Live Preview
        </div>
        <div className="flex-1 p-10 overflow-auto flex justify-center items-start">
          {currentSchema.length > 0 ? (
            <div className="w-full max-w-5xl space-y-6 animate-in zoom-in-95 duration-300">
              {currentSchema.map((item, i) => renderComponent(item, i))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 w-full flex items-center justify-center text-gray-400">
              No UI generated yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
