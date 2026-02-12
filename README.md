# Ryze AI - Deterministic UI Generator Agent

A "Claude-style" AI agent that generates deterministic, safe, and editable React UI from natural language prompts.

## 🏗️ Architecture

This project uses a **Planner-Generator-Renderer** pattern to ensure safety and determinism:

1.  **Planner Agent (Brain):** - Accepts user intent.
    - Outputs a strict JSON Schema (AST).
    - Enforces a Component Whitelist (Button, Card, Navbar, Sidebar, Modal).
    - **Model:** Llama 3 70B (via Groq) / GPT-4o-mini (via OpenAI).

2.  **Generator (Compiler):**
    - Deterministically converts the JSON Schema into valid React JSX code strings.
    - Handles nested children and array props recursively.
    - Prevents hallucinated classes or styles by strictly mapping to the fixed component library.

3.  **Renderer (Runtime):**
    - A safe runtime environment that renders the generated components.
    - Supports "Time Travel" (Undo/Redo) by maintaining a state history stack.

## 🛡️ Key Features

* **Deterministic Output:** The AI cannot invent new components or styles. It must use the fixed `src/components/library` registry.
* **Safety Layer:** All AI output is validated against a whitelist before rendering. Invalid JSON or disallowed components are rejected.
* **Iterative Editing:** The agent receives the *current* UI state, allowing for incremental updates (e.g., "Add a button to the card") without wiping the existing layout.
* **Time Travel:** Full Undo/Redo support using an in-memory history stack.
* **Live Preview:** Real-time rendering of the generated code.

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **AI Inference:** Groq SDK (Llama 3) / OpenAI SDK
* **Icons:** Lucide React

## 🚀 Trade-offs & Design Decisions

* **JSON vs. Direct Code Generation:** I chose to have the Planner output **JSON** instead of raw JSX. This acts as an Intermediate Representation (IR) layer, making validation, security, and partial updates significantly easier and safer than regex-parsing raw code.
* **Strict Whitelisting:** To meet the "Deterministic" requirement, the system strictly ignores any AI request for a component not in the registry. This trades off "creative flexibility" for "guaranteed correctness."
* **State Management:** I used React local state for simplicity and speed. For a production app, I would move the history stack to a global store (Zustand) or persist it to a database.

## 📦 How to Run

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Add API Key to `.env.local`: `GROQ_API_KEY=gsk_...`
4.  Run development server: `npm run dev`