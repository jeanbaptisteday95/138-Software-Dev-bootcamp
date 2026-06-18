# Creating a Custom Copilot Agent in VS Code

## What Is a Custom Agent — and Why Bother?

In the last class, we used VS Code's built-in Agent mode. That's a general-purpose agent: it can help with any coding task, but it knows nothing specific about you, your project, your team's conventions, or your preferred tools.

A **custom agent** lets you bake all of that in permanently. You write a short file that tells the agent:

- **Who it is** — what role it plays ("you are a Node.js API developer")
- **What rules it follows** — your team's conventions, naming patterns, error handling approach
- **What tools it can use** — which built-in tools to allow (or restrict)
- **How it should behave** — tone, how much to explain, whether to ask questions or just get on with it

Once created, your custom agent appears in the Copilot Chat dropdown, right alongside the built-in ones. Any teammate can select it and immediately get an AI that behaves consistently for your project.

---

## How It Works — The File Format

Custom agents live in a file called `<agentname>.agent.md`, stored in a special folder: `.github/agents/` inside your project.

The file has two parts:

```
--- ← start of settings block (called frontmatter)
name: "Your Agent Name"
description: "What this agent does, shown in the dropdown"
tools:
  - tool1
  - tool2
--- ← end of settings block

Everything below here is the agent's instructions, written in plain English.
The agent reads these every time before it responds to you.
```

That's it. A plain text file. No code, no special software, no deployment.

---

## Part 1 — Set Up the Project

We're going to build a small Node.js REST API project and create a custom agent tuned specifically for it.

### 1.1 — Create the Project Folder

Open a terminal (anywhere on your machine) and run:

```bash
mkdir todo-api
cd todo-api
git init
npm init -y
```

Then open this folder in VS Code:

```bash
code .
```

### 1.2 — Install One Dependency

use **Express** 

```bash
npm install express
```

Your folder should now look like this:

```
todo-api/
├── node_modules/
├── package.json
├── package-lock.json
```

---

## Part 2 — Create the Custom Agent File

### 2.1 — Create the Folder Structure

In VS Code's Explorer panel (the file tree on the left), create this folder path:

```
.github/
  agents/
```


### 2.2 — Create the Agent File

Inside `.github/agents/`, create a new file called:

```
nodejs-dev.agent.md
```

> **Naming rules:** Only letters, numbers, hyphens, and underscores before `.agent.md`. No spaces.

### 2.3 — Paste This Content Into the File

Copy and paste the following exactly:

```markdown
---
name: "Node.js Dev"
description: "A Node.js/Express API developer. Builds clean, consistent REST APIs with good error handling."
tools:
  - codebase
  - editFiles
  - runCommands
  - search
---

You are a Node.js and Express developer working on a REST API project.

## Your coding rules (always follow these)

- Always use `const` or `let`, never `var`
- Always use `async/await` for asynchronous code, never `.then()` chains
- Every route handler must have a `try/catch` block — never leave errors unhandled
- Return consistent JSON responses: always include a `success` field (boolean) and either `data` or `error`
- Use meaningful variable names — never single letters except in `for` loops
- Add a short comment above each function explaining what it does

## How you respond

- Before writing any code, briefly state what you are about to do (one sentence)
- If a task is ambiguous, ask ONE clarifying question before proceeding
- After creating or modifying a file, tell the user what to do next (e.g. "Run this with `node index.js`")
- Keep explanations short — this is a developer workflow, not a tutorial

## Project context

- Framework: Express.js
- Language: JavaScript (Node.js)
- The API follows REST conventions: GET to read, POST to create, PUT to update, DELETE to remove
- Errors should always return an appropriate HTTP status code (400 for bad input, 404 for not found, 500 for server errors)
```

Save the file (`Ctrl+S` or `Cmd+S`).

### 2.4 — Activate the Agent

1. Open Copilot Chat: **Ctrl+Alt+I** (Windows/Linux) or **Cmd+Ctrl+I** (Mac)
2. Click the **mode dropdown** at the top of the chat panel
3. You should now see **"Node.js Dev"** in the list alongside the built-in agents
4. Select it

> **Don't see it yet?** Try closing and reopening the Chat panel, or press `F1` and run "Developer: Reload Window".

---

## Part 3 — The Exercise

You're going to build a simple To-Do API by having a back-and-forth conversation with your custom agent. The goal isn't just to get working code — it's to see how a focused, well-instructed agent behaves differently from a generic one.

Work through these prompts **one at a time**, in order. Read the agent's response before moving to the next one.

---

### Prompt 1 — Start the Conversation

Type this into the chat:

```
I need to build a simple to-do list REST API. 
The API should let users create, read, update and delete to-do items.
For now, store everything in memory (no database needed).
Where should we start?
```

**What to watch for:**
- Does the agent ask a clarifying question before diving in, as instructed?
- Does it briefly explain the plan before writing code?
- How does it compare to what a generic "Ask" mode might say?

---

### Prompt 2 — Build the First Route

After reading the agent's response, type:

```
Let's start with the GET route to list all to-do items, and the POST route to create a new one.
Each to-do should have an id, a title, a done field (true/false), and a createdAt timestamp.
```

**What to watch for:**
- Does every route have a `try/catch` block? (it should — that's in the rules)
- Does the response JSON always have a `success` field? (also in the rules)
- Does the agent tell you what to do after it creates the file?

---

### Prompt 3 — Deliberately Give It an Ambiguous Request

This is the important one. Type:

```
Now add the ability to update a to-do.
```

**What to watch for:**
- The agent's rules say: *"If a task is ambiguous, ask ONE clarifying question before proceeding."*
- Does it ask you something before writing code? (e.g. "Should updating a to-do allow changing the title, or just marking it as done, or both?")
- If it does ask — answer it, and see how it uses your answer in the code it then produces

If the agent skips the question and writes code anyway, that's worth noting — agents don't always follow instructions perfectly, which is exactly why validation (from the structured outputs section of the lesson) matters in real applications.

---

### Prompt 4 — Add Error Handling for a Missing Item

Type:

```
What happens right now if someone tries to update or get a to-do that doesn't exist?
Fix it so we return a proper 404 response in that case.
```

**What to watch for:**
- Does it correctly return a 404 status code with a `success: false` JSON response?
- Does it check *all* the relevant routes, or just one?

---

### Prompt 5 — Ask It to Explain Its Own Code

Type:

```
I'm new to Express. Can you walk me through what app.use(express.json()) does
and why it has to come before the routes?
```

**What to watch for:**
- The agent's rules say to keep explanations short
- Does it honour that? Or does it write a 10-paragraph essay?
- Compare this to asking the same question in generic "Ask" mode — is the Node.js Dev agent more or less verbose?

---

### Prompt 6 — Test It Works

Type:

```
Run the server and then use a terminal command to test the POST /todos route
by creating a to-do with the title "Learn about AI agents".
Show me the response.
```

**What to watch for:**
- The agent will likely run `node index.js` in one terminal, then a `curl` command in another
- Watch the Thought → Action → Observation loop happen for real
- Does the response JSON match the format you defined (with `success`, `data`, etc.)?

---

## Part 4 — Reflection

Once you've worked through the prompts,  write down your answers:

**On custom agents:**

1. Look back at the code the agent produced across all 6 prompts. Does it look consistent — same JSON format, same error handling pattern, same use of `async/await`? That consistency came from the rules in your `.agent.md` file.

2. If you'd used the generic Agent mode instead, would you have needed to repeat your conventions in every single prompt? What's the cost of that over a long project?

3. Your `.agent.md` file is stored in `.github/agents/` — which means it's committed to the project's Git repository. What does that mean for a team of 10 developers all using the same agent?

**On the agent's behaviour:**

4. Did the agent always follow its rules perfectly? In particular, did it always ask a clarifying question when the request was ambiguous (Prompt 3)? What does that tell you about relying on agents for critical tasks?

5. In Prompt 6, you watched the agent start a server, run a test command, and read the output. Which parts of that were AI-generated text (Thought/Action), and which parts were your actual computer doing real things (Observation)?

---

## Part 5 — Modify the Agent (Optional Challenge)

Now that you've seen the agent in action, open `.github/agents/nodejs-dev.agent.md` and add one new rule of your own. Something like:

- *"Always add JSDoc comments to every function"*
- *"Never use `console.log` — use a comment saying `// TODO: add proper logging` instead"*
- *"After creating any file, also create a matching `filename.test.js` stub with a placeholder test"*

Save the file, then go back to chat (you may need to start a new chat session for the change to take effect) and ask the agent to add the DELETE route. Does your new rule show up in what it produces?

---

## What Your Final File Structure Should Look Like

```
todo-api/
├── .github/
│   └── agents/
│       └── nodejs-dev.agent.md   ← your custom agent definition
├── node_modules/
├── index.js                      ← created by the agent during the exercise
├── package.json
└── package-lock.json
```

---

## Key Things to Take Away

| What you did | Why it matters |
|---|---|
| Created an `.agent.md` file with rules and tools | This is a plain text file — no code, no deployment, immediately usable by any teammate with Copilot |
| Gave the agent a consistent JSON response format | Every route the agent wrote followed the same structure without you having to repeat it |
| Used an ambiguous prompt to trigger a clarifying question | Shows that a well-designed agent knows when it needs more information before acting |
| Committed the agent file to the repo | The entire team gets the same AI behaviour, automatically, just by pulling the latest code |
| Watched the agent loop in Prompt 6 | Saw the Thought → Action → Observation cycle from the lesson happen live |
