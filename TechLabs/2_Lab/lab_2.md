---
marp: true
theme: default
paginate: true
---

![](../../resources/images/circuitstream_logo.png)

# Software Development Bootcamp

## Lab 2: JavaScript with AI

### Gurneesh Singh

---

# Learning Objectives

- Leverage GitHub Copilot to code JavaScript functions
- Practice all core JavaScript concepts from Unit 2
- Build real projects using AI assistance

---

# Setup & Key Points

- You are encouraged to use GitHub Copilot in the new "agent" mode.
- **Goal:** Use AI as a "pair programmer" tool, not a replacement for thinking.
- Each exercise focuses on a specific concept from Unit 2.
- Use AI to help debug and explain code, but try problems yourself first.

---

# Prerequisites: Setting Up GitHub Copilot in VS Code

## Step 1: Install GitHub Copilot Extension

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "GitHub Copilot"
4. Install both:
   - **GitHub Copilot** (main extension)
   - **GitHub Copilot Chat** (chat interface)

## Step 2: Sign In to GitHub

1. After installation, click the Copilot icon in the sidebar
2. Sign in with your GitHub account
3. If you don't have GitHub Copilot subscription, you can use the free tier

## Step 3: Enable Agent Mode (Recommended)

1. Open Copilot Chat (Ctrl+Shift+I / Cmd+Shift+I)
2. Click on the agent mode toggle
3. Select "Agent" mode for more autonomous code assistance

## Step 4: Using Copilot Effectively

### Keyboard Shortcuts:

- **Open Copilot Chat**: `Ctrl+Shift+I` (Windows) / `Cmd+Shift+I` (Mac)
- **Accept Suggestion**: `Tab`
- **Reject Suggestion**: `Esc`
- **Trigger Inline Completion**: Start typing and wait for suggestions

### Best Practices:

- Write comments describing what you want to build
- Use Copilot Chat for complex explanations
- Use inline suggestions for simple code patterns
- Always review and understand AI-generated code

---

## Exercise 1: Student Grade Tracker (1 Hour 10 Minutes)

**Objective:** Build a complete student grade management system combining multiple Unit 2 concepts.

**Topics Covered:**

- Variables, data types, operators (Lesson 1)
- Functions and conditionals (Lesson 2)
- Loops and array methods (Lesson 3)
- Objects and OOP (Lesson 4)

---

### Part A: Data Structure Setup

Create a program that manages student data:

1. Create an array of student objects, each containing:
   - `name` (string)
   - `id` (number)
   - `grades` (array of numbers)
   - `attendance` (number: 0-100)

2. Use different variable declarations (`let`, `const`) appropriately

---

### Part B: Grade Calculation Functions

Build functions to analyze student performance:

1. **calculateAverage(student)** - Use a for loop or reduce to calculate average grade
2. **getLetterGrade(score)** - Use switch statement to return A/B/C/D/F
3. **getStatus(student)** - Use if/else to determine if student is passing (avg >= 60 AND attendance >= 75)

---

### Part C: Data Transformation

Use array methods to transform and filter data:

1. Use `.map()` to create a new array with student names and their letter grades
2. Use `.filter()` to get list of passing students
3. Use `.sort()` to order students by their average grade (highest first)
4. Use `.find()` to locate a specific student by ID

---

### Part D: OOP Enhancement

Convert the functional approach to an object-oriented design:

1. Create a `Student` class with:
   - Constructor taking name, id, grades
   - Method `calculateAverage()`
   - Method `getLetterGrade()`
   - Getter for passing status

2. Create a `Course` class with:
   - Array of Student instances
   - Method `addStudent()`
   - Method `getClassAverage()`
   - Method `getTopStudents(n)`

---

## Exercise 2: Task Manager Application (1 Hour 10 Minutes)

**Objective:** Build an interactive task management application combining async and DOM concepts.

**Topics Covered:**

- DOM manipulation (Lesson 5)
- Async JavaScript (Lesson 6)
- JSON & APIs (Lessons 7-8)

---

### Part A: HTML Structure & Basic DOM

Create the visual interface:

1. Create an HTML page with:
   - Input field for new task
   - Priority selector (High, Medium, Low)
   - Add task button
   - Filter buttons (All, Active, Completed)
   - Task list container
   - Task count display

---

2. Use JavaScript to:
   - Select elements using `querySelector` and `getElementById`
   - Create new elements dynamically using `createElement`
   - Add text content and attributes

---

### Part B: Event Handling

Make the interface interactive:

1. Add click event listener to add button
2. Add 'keypress' event for Enter key on input
3. Create event handler that:
   - Validates input (not empty)
   - Creates task object
   - Calls render function

---

### Part C: Task Operations & State Management

Implement task CRUD operations:

1. Add new tasks to the list
2. Mark tasks as complete/incomplete (toggle)
3. Delete tasks from the list
4. Filter tasks by status (all/active/completed)

---

### Part D: Data Persistence

Save and load tasks:

1. Use `JSON.stringify()` to save tasks to localStorage
2. Use `JSON.parse()` to load tasks on page refresh

---

### Bonus: Async Feature (Optional)

Add simulated async operation:

1. Create a function that simulates saving to a server using Promises
2. Use `setTimeout` to add artificial delay
3. Show loading state during "save"
4. Use async/await to handle the operation

---

## Reflection Questions

1. **AI Collaboration:**
   - What was easy with GitHub Copilot?
   - What was hard with it?
   - How would you use it effectively?

2. **When to Use AI:**
   - When might you avoid using it?
   - How does it compare to ChatGPT?

---

3. **Learning Impact:**
   - How could it help a beginner?
   - How could it hurt the learning process?

4. **Technical Questions:**
   - Which Unit 2 concept was most challenging?
   - How did using AI help/hinder your understanding?

---

# Cheat Sheet: Copilot Commands

| Action            | Command/Prompt                |
| ----------------- | ----------------------------- |
| Explain code      | "Explain this code"           |
| Debug error       | "Why is this giving [error]?" |
| Generate function | "Write a function that..."    |
| Add comments      | "Add comments to this code"   |
| Refactor          | "Make this more efficient"    |
