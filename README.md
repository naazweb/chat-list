# Goal

Build a small full-stack Task Management app where the primary UI for creating, viewing, filtering, and updating tasks is an AI chat interface (not a traditional CRUD form + list).
Use TanStack (Start preferred) as the foundation and integrate Vercel AI SDK and AI Elements.

## Stack requirements

TanStack Start (full-stack).
AI SDK (Vercel) for chat streaming + tool calling.
AI Elements for the chat UI components.
TypeScript end-to-end.

## UX: “Chat is the app”

A single page (e.g., /) with:
A list of tasks on the left and A chat panel on the right where the user can say things like:
“Add ‘Submit expense report’ due Friday, high priority”
“Show me overdue tasks”
“Mark the expense report done”
“Rename that to ‘Submit January expense report’”
“What are my top 3 priorities today?”

The assistant responds conversationally and/or updates the task list.

## Acceptance tests (functional checklist)

A reviewer must be able to:
- Start the app with pnpm dev (or npm dev) and open it.
- Type: “Add task ‘Buy milk’ due tomorrow high priority”
-- Task is persisted and confirmed in chat.
- Type: “List my tasks”
-- Chat displays tasks as structured cards.
- Type: “Mark ‘Buy milk’ done”
-- Status changes; listing shows it done.
- Type: “Delete ‘Buy milk’”
-- It disappears from subsequent lists.
- Type: “Show overdue tasks”
-- Filter works based on dates.