# Ryze AI - Deterministic UI Generator Agent

A "Claude-style" AI agent that generates deterministic, safe, and editable React UI from natural language prompts.

---

## 🏗️ Architecture Overview

The project utilizes a **Planner-Generator-Renderer** pattern to ensure safety and determinism in UI creation:

1. **Planner Agent (The Brain):**
* Accepts user intent through a POST request.
* Outputs a strict JSON Schema acting as an Abstract Syntax Tree (AST).
* Enforces a strict component whitelist.
* **Model:** Powered by Llama 3 (via Groq).


2. **Generator (The Compiler):**
* Located in `src/lib/generator.ts`.
* Deterministically converts the JSON Schema into valid React JSX code strings.
* Recursively handles nested children and specific props like Sidebar items.
* Prevents hallucinated styles by mapping strictly to the fixed library.


3. **Renderer (The Runtime):**
* A safe runtime environment in `src/app/page.tsx` that renders components based on the schema.
* Supports "Time Travel" (Undo/Redo) by maintaining a state history stack.



---

## 🧠 Agent Design & Prompts

The agent is designed with multi-step orchestration to ensure correctness:

* **Strict JSON Prompting:** The planner is instructed via a system prompt to return **valid JSON ONLY**, explicitly forbidding markdown, backticks, or conversational explanations.
* **Iterative Context:** The agent receives the `currentCode` with every request, allowing it to perform incremental edits (e.g., adding a button to an existing card) rather than full rewrites.
* **Component Whitelisting:** The prompt strictly limits the AI to a predefined list: `Button`, `Card`, `Navbar`, `Sidebar`, and `Modal`.

---

## 🧱 Component System Design

The system relies on a **Locked Component Registry** to maintain visual consistency:

* **Fixed Library:** Components in `src/components/library` use hardcoded Tailwind CSS classes.
* **No Dynamic Styling:** The AI cannot generate arbitrary CSS or Tailwind classes; it can only toggle predefined variants (e.g., `primary` vs. `secondary` for Buttons).
* **Structured Props:** Components expect specific data structures, such as the `Sidebar` requiring an `items` array of strings.
* **Composition:** The `Card` component is designed to accept `children`, allowing the AI to nest other components like Buttons or Inputs inside it.

---

## 🛡️ Key Features

* **Deterministic Output:** AI output is constrained to a fixed registry, preventing stylistic hallucinations.
* **Safety Layer:** JSON output is validated before rendering to ensure only allowed components are used.
* **Iteration Awareness:** The system supports modifying existing UI via chat without losing previous work.
* **Time Travel:** Users can roll back to previous versions of the UI using the Undo/Redo functionality.
* **Live Preview:** Real-time rendering of generated code in a dedicated preview panel.

---

## ⚠️ Known Limitations

* **Fixed Styles:** No support for custom inline styles or AI-generated CSS.
* **Component Scope:** Limited to the five components currently in the library.
* **State Persistence:** History and current UI state are stored in-memory; refreshing the browser will reset the session.

---

## 🛠️ What I’d Improve with More Time

* **Streaming Responses:** Implement streaming for the AI's "thought process" and code generation for a better UX.
* **Schema Validation:** Integrate a validation library like Zod to ensure the AI's JSON perfectly matches expected component props.
* **Persistent Storage:** Add a database (e.g., Supabase or MongoDB) to save and share generated UI versions.
* **Advanced Diff View:** Add a visual code diff to highlight exactly what changed between iterations.

---

## 📦 How to Run

1. **Clone the repository**.
2. **Install dependencies:** `npm install`.
3. **Configure Environment:** Add `GROQ_API_KEY` to your `.env.local`.
4. **Run Development Server:** `npm run dev`.