# 🏗️ High-Level Design (HLD)

# AI Study Assistant

**Version:** 1.0 (Pre-RAG Architecture)

**Tech Stack:** Next.js 15 • Gemini 2.5 Flash • Tailwind CSS • JavaScript

---

# 1. Project Overview

## Objective

AI Study Assistant is a web-based chatbot that helps students learn Computer Science subjects such as DSA, DBMS, Operating Systems, Java, and Full Stack Development using Google's Gemini AI model.

The application is designed to provide **real-time streaming AI responses**, creating an experience similar to ChatGPT while maintaining a modular architecture that can later be extended with Retrieval-Augmented Generation (RAG).

## Goals

* Provide an AI-powered study assistant.
* Generate answers using Gemini 2.5 Flash.
* Stream responses token-by-token.
* Keep the frontend modular using reusable React components.
* Prepare the project for future PDF-based RAG.

## Target Users

* College Students
* Kalvium Students
* Software Engineering Interview Preparation
* Self-learning Developers

---

# 2. System Architecture

## High-Level Architecture

```text
                   ┌─────────────────────────┐
                   │        User Browser      │
                   │     AI Study Assistant   │
                   └─────────────┬───────────┘
                                 │
                                 │ HTTP POST
                                 ▼
                   ┌─────────────────────────┐
                   │     Next.js API Route    │
                   │      /api/chat           │
                   └─────────────┬───────────┘
                                 │
                                 │ Gemini SDK
                                 ▼
                   ┌─────────────────────────┐
                   │    Gemini 2.5 Flash      │
                   │ generateContentStream()  │
                   └─────────────┬───────────┘
                                 │
                                 │ Streamed Text Chunks
                                 ▼
                   ┌─────────────────────────┐
                   │     ReadableStream       │
                   └─────────────┬───────────┘
                                 │
                                 │ Chunk-by-chunk Response
                                 ▼
                   ┌─────────────────────────┐
                   │     Next.js Frontend     │
                   │ Chat Bubble Updates Live │
                   └─────────────────────────┘
```

---

## Architecture Layers

### 1. Presentation Layer

Responsible for rendering the user interface.

**Responsibilities**

* Chat UI
* User Input
* Message Rendering
* Loading Indicator
* Streaming Text Rendering

**Technology**

* Next.js App Router
* React
* Tailwind CSS

---

### 2. API Layer

Acts as a secure gateway between frontend and Gemini.

**Responsibilities**

* Receive user prompt.
* Validate request.
* Call Gemini SDK.
* Stream response using Web Streams API.
* Handle API errors.

**Technology**

* Next.js API Routes
* JavaScript
* ReadableStream

---

### 3. AI Layer

Responsible for text generation.

**Responsibilities**

* Understand prompt.
* Generate AI response.
* Stream generated text.

**Technology**

* Gemini 2.5 Flash
* Google GenAI SDK

---

# 3. Component Architecture

## React Component Tree

```text
ChatPage
│
├── ChatHeader
│
├── Messages Section
│     ├── ChatMessage
│     ├── ChatMessage
│     ├── ChatMessage
│     ├── LoadingBubble
│     └── EmptyChat
│
└── ChatInput
```

## Component Responsibilities

| Component     | Responsibility                                       |
| ------------- | ---------------------------------------------------- |
| ChatPage      | State management, API communication, streaming logic |
| ChatHeader    | Application title and online status                  |
| ChatMessage   | Displays user and Gemini messages                    |
| ChatInput     | Handles typing, Enter key and Send button            |
| LoadingBubble | Shows "Gemini is thinking..." indicator              |
| EmptyChat     | Welcome screen before first message                  |

---

# 4. Folder Structure

```text
ai-study-assistant/
│
├── app/
│   ├── chat/
│   │   └── page.js
│   │
│   └── api/
│       └── chat/
│           └── route.js
│
├── components/
│   ├── ChatHeader.js
│   ├── ChatMessage.js
│   ├── ChatInput.js
│   ├── LoadingBubble.js
│   └── EmptyChat.js
│
├── lib/
│   └── gemini.js
│
├── public/
│
├── .env.local
│
├── README.md
└── HLD.md
```

---

# 5. Request Flow

## User Request Lifecycle

```text
User types question
        │
        ▼
sendMessage()
        │
        ▼
POST /api/chat
        │
        ▼
Next.js API Route
        │
        ▼
Gemini 2.5 Flash
        │
        ▼
Streaming Response
        │
        ▼
ReadableStream
        │
        ▼
Frontend Updates Chat Bubble
```

## Request Sequence

### Step 1

User enters a prompt.

Example:

```
Explain Merge Sort.
```

### Step 2

`sendMessage()` validates the input.

### Step 3

Frontend immediately displays the user message.

### Step 4

Frontend sends POST request.

```http
POST /api/chat
```

Request Body

```json
{
  "message": "Explain Merge Sort."
}
```

### Step 5

API Route forwards prompt to Gemini.

### Step 6

Gemini begins generating streamed text.

### Step 7

Backend forwards chunks through ReadableStream.

### Step 8

Frontend receives chunks and updates the last AI bubble continuously.

---

# 6. Streaming Response Architecture

## Why Streaming?

Traditional AI APIs wait until the complete answer is generated.

Streaming sends partial responses immediately.

**Benefits**

* Faster perceived response.
* Better user experience.
* ChatGPT-like typing effect.

## Streaming Flow

```text
Gemini Generates Text

Chunk 1 → "Merge"

Chunk 2 → " Sort is"

Chunk 3 → " a divide"

Chunk 4 → " and conquer algorithm..."

Frontend combines chunks continuously.
```

## Backend Streaming Pipeline

```text
Gemini SDK
      │
      ▼
generateContentStream()
      │
      ▼
Async Chunks
      │
      ▼
TextEncoder
      │
      ▼
ReadableStream
      │
      ▼
HTTP Response Stream
```

## Frontend Streaming Pipeline

```text
fetch("/api/chat")
        │
        ▼
response.body.getReader()
        │
        ▼
TextDecoder
        │
        ▼
Chunk
        │
        ▼
Update Last AI Message
```

---

# 7. State Management Design

## React States

| State    | Purpose                       |
| -------- | ----------------------------- |
| messages | Stores conversation history   |
| message  | Current input field text      |
| loading  | Tracks AI response generation |

## Messages Data Model

```javascript
[
  {
    role: "user",
    text: "Explain Stack."
  },
  {
    role: "ai",
    text: "Stack is a linear data structure..."
  }
]
```

### Message Roles

| Role | Meaning                   |
| ---- | ------------------------- |
| user | User-generated message    |
| ai   | Gemini-generated response |

---

# 8. API Design

## Endpoint

```http
POST /api/chat
```

### Request Payload

```json
{
  "message": "What is DBMS?"
}
```

### Response Type

Instead of JSON, the endpoint returns a streamed HTTP response.

**Content-Type**

```
text/plain; charset=utf-8
```

### Error Response

```http
500 Internal Server Error
```

Response

```text
Something went wrong.
```

---

# 9. Error Handling Strategy

## Frontend

* Prevent empty prompts.
* Disable send button while loading.
* Show loading bubble.
* Show friendly error bubble if API fails.

## Backend

* Wrap Gemini call inside try-catch.
* Log server errors.
* Return HTTP 500 response.

---

# 10. Security Design

## API Key Protection

Gemini API key is stored in:

```
.env.local
```

Example

```env
GEMINI_API_KEY=xxxxxxxxxxxxxxxx
```

### Why?

The API key never reaches the browser.

Only the server-side API route accesses Gemini.

## Communication Flow

```text
Browser
   │
   ▼
Next.js API Route
   │
   ▼
Gemini
```

The browser never communicates directly with Gemini.

---

# 11. Technology Stack

| Layer     | Technology       |
| --------- | ---------------- |
| Frontend  | Next.js 15       |
| UI        | React            |
| Styling   | Tailwind CSS     |
| AI SDK    | Google GenAI SDK |
| AI Model  | Gemini 2.5 Flash |
| Streaming | Web Streams API  |
| Language  | JavaScript       |

---

# 12. Non-Functional Requirements

## Performance

* Streaming starts within the first response chunk.
* Lightweight frontend.
* Responsive layout.

## Scalability

Architecture is modular.

Future features can be added without changing the chat UI.

Examples

* PDF Upload
* Notes Search
* RAG
* Chat History
* Authentication

## Maintainability

Reusable React components reduce code duplication.

API logic is isolated from UI components.

---

# 13. Future Architecture (Phase 5 - RAG)

The next version extends the architecture with document retrieval.

```text
User Uploads PDF
        │
        ▼
PDF Parser
        │
        ▼
Chunk Generator
        │
        ▼
Embedding Generator
        │
        ▼
Vector Store
        │
        ▼
Relevant Context Retrieved
        │
        ▼
Gemini Prompt + Context
        │
        ▼
Streaming Response
```

This architecture keeps the current chat module unchanged while adding a retrieval layer before Gemini.

---

# 14. Learning Outcomes

This project demonstrates understanding of:

### Frontend Engineering

* React Components
* Props
* State Management
* Conditional Rendering
* Event Handling
* Tailwind CSS

### Next.js

* App Router
* API Routes
* Server-side API handling
* Environment Variables

### AI Engineering

* Gemini SDK Integration
* Streaming Responses
* ReadableStream
* TextEncoder / TextDecoder
* Async Iteration (`for await...of`)

### Software Design

* Layered Architecture
* Modular Components
* Separation of Concerns
* API Gateway Pattern
* Scalable AI Application Design

---

# 15. HLD Summary

The AI Study Assistant follows a modular three-layer architecture where the frontend handles presentation, Next.js API routes handle secure communication with Gemini, and Gemini streams responses using Web Streams API.

The architecture is intentionally designed to support future Retrieval-Augmented Generation without requiring major changes to the existing chat interface.
