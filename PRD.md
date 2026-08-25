# ⚙️ Low-Level Design (LLD)

# AI Study Assistant

**Version:** 1.0 (Streaming Chat Architecture)

**Tech Stack:** Next.js 15 • React • JavaScript • Gemini 2.5 Flash • Tailwind CSS

---

# Table of Contents

1. Introduction
2. Project Structure
3. Component Design
4. State Management Design
5. API Route Design
6. Gemini Integration
7. Streaming Implementation
8. Data Models
9. Function-Level Design
10. Error Handling
11. Sequence Diagram
12. Future Extension Points

---

# 1. Introduction

## Purpose

This Low-Level Design explains the internal implementation of the AI Study Assistant application.

Unlike the High-Level Design, this document focuses on:

* Individual files.
* React component responsibilities.
* State variables.
* API implementation.
* Gemini SDK integration.
* Streaming response implementation.
* Error handling logic.

---

# 2. Project Structure

```text
ai-study-assistant/
│
├── app/
│   ├── page.js
│   │
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
├── HLD.md
└── LLD.md
```

---

# 3. Component Design

## 3.1 Chat Page (`app/chat/page.js`)

### Responsibility

Main client-side component responsible for:

* Managing chat state.
* Sending prompts.
* Reading streaming responses.
* Updating UI.

### State Variables

| State      | Type    | Purpose                        |
| ---------- | ------- | ------------------------------ |
| `messages` | Array   | Conversation history.          |
| `message`  | String  | Current input text.            |
| `loading`  | Boolean | AI response loading indicator. |

### High-Level Flow

```text
User Input
    │
    ▼
sendMessage()
    │
    ▼
fetch("/api/chat")
    │
    ▼
Read Stream
    │
    ▼
Update Last AI Bubble
```

---

## 3.2 ChatHeader Component

### Responsibility

Displays:

* Project title.
* Gemini model information.
* Online status indicator.

### Props

No props.

### UI Elements

* Brain icon.
* Project title.
* Subtitle.
* Online badge.

---

## 3.3 ChatMessage Component

### Responsibility

Displays one message bubble.

### Props

| Prop      | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| `message` | Object | Message object received from parent. |

### Logic

Checks:

```javascript
message.role === "user"
```

If true:

* Right aligned.
* Blue background.

Else:

* Left aligned.
* White background.
* Gemini label.

### Bubble Styles

| Role | Alignment | Color |
| ---- | --------- | ----- |
| user | Right     | Blue  |
| ai   | Left      | White |

---

## 3.4 ChatInput Component

### Responsibility

* Input field.
* Send button.
* Enter key support.

### Props

| Prop          | Purpose                          |
| ------------- | -------------------------------- |
| `message`     | Current input value.             |
| `setMessage`  | Updates input state.             |
| `sendMessage` | Sends prompt.                    |
| `loading`     | Disables button during response. |

### Keyboard Handling

```javascript
if (e.key === "Enter" && !loading)
```

Triggers message submission.

---

## 3.5 LoadingBubble Component

### Responsibility

Displays temporary loading indicator while Gemini generates response.

### Behaviour

Visible only when:

```javascript
loading === true
```

---

## 3.6 EmptyChat Component

### Responsibility

Displayed when no messages exist.

Condition:

```javascript
messages.length === 0
```

Provides welcome screen.

---

# 4. State Management Design

## React State Flow

```text
User Types
      │
      ▼
message State
      │
      ▼
sendMessage()
      │
      ▼
messages State Updated
      │
      ▼
React Re-render
```

---

## Messages State Structure

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

### Properties

| Property | Description     |
| -------- | --------------- |
| role     | user or ai      |
| text     | Message content |

---

## Loading State Lifecycle

```text
loading = false

User clicks Send

loading = true

Streaming Starts

Streaming Ends

loading = false
```

---

# 5. API Route Design

## File

```text
app/api/chat/route.js
```

### Responsibility

Acts as backend endpoint between frontend and Gemini.

### Endpoint

```http
POST /api/chat
```

---

## Request Payload

```json
{
  "message": "Explain Trees."
}
```

### Processing Steps

1. Parse request body.
2. Call Gemini streaming API.
3. Encode streamed text.
4. Return ReadableStream.

---

## Response Type

Instead of JSON:

```http
Content-Type:
text/plain; charset=utf-8
```

Reason:

Frontend consumes streamed text chunks.

---

# 6. Gemini Integration

## File

```text
lib/gemini.js
```

### Responsibility

Creates reusable Gemini client.

### Initialization

Reads API key from environment variable.

```env
GEMINI_API_KEY=xxxxxxxx
```

### Export

Exports initialized Gemini instance.

### Why Separate File?

Benefits:

* Single initialization.
* Reusable.
* Cleaner API routes.
* Easier future configuration.

---

# 7. Streaming Implementation

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
HTTP Response
```

---

## Backend Streaming Logic

### Step 1

Call:

```javascript
generateContentStream()
```

Returns async iterable response.

### Step 2

Create encoder.

Purpose:

Convert text into UTF-8 bytes.

### Step 3

Create ReadableStream.

### Step 4

Iterate chunks.

```javascript
for await (const chunk of response)
```

### Step 5

Push bytes.

```javascript
controller.enqueue(...)
```

### Step 6

Finish stream.

```javascript
controller.close()
```

---

## Frontend Streaming Pipeline

```text
fetch()
   │
   ▼
response.body
   │
   ▼
getReader()
   │
   ▼
read()
   │
   ▼
decode()
   │
   ▼
Update UI
```

---

## Frontend Streaming Lifecycle

### Initial State

```javascript
{
  role: "ai",
  text: ""
}
```

### Chunk 1

```text
Dynamic
```

Updates AI bubble.

### Chunk 2

```text
 Programming
```

Appends.

### Chunk 3

```text
 is a technique...
```

Appends.

Result:

Continuous typing effect.

---

## Why Last Message Updates?

Instead of creating many bubbles.

```text
Wrong

AI
Hello

AI
World

AI
Again
```

Correct

```text
AI

Hello

Hello World

Hello World Again
```

Better UX.

---

# 8. Data Models

## Message Model

```javascript
{
  role: "user",
  text: "What is DBMS?"
}
```

### Fields

| Field | Type   | Description  |
| ----- | ------ | ------------ |
| role  | String | user / ai    |
| text  | String | Message body |

---

## Request Model

```javascript
{
  message: "Explain Merge Sort"
}
```

---

## Error Message Model

```javascript
{
  role: "ai",
  text: "Sorry, I couldn't generate a response."
}
```

Used inside catch block.

---

# 9. Function-Level Design

## sendMessage()

### Purpose

Main frontend function.

### Inputs

Current message state.

### Output

Updates conversation UI.

### Algorithm

```text
Validate Input

↓

Create User Message

↓

Add User Bubble

↓

Clear Input

↓

loading = true

↓

POST Request

↓

Create Empty AI Bubble

↓

Read Stream

↓

Append Chunks

↓

loading = false
```

---

## ChatMessage()

### Purpose

Render message bubble.

### Decision Logic

```text
role == user ?

YES → Right Bubble

NO → Left Bubble
```

---

## ChatInput()

### Purpose

Capture user prompt.

### Events

| Event     | Action               |
| --------- | -------------------- |
| onChange  | Update message state |
| onClick   | sendMessage()        |
| Enter Key | sendMessage()        |

---

## API Route POST()

### Purpose

Generate streamed response.

### Algorithm

```text
Receive Request

↓

Read JSON Body

↓

Gemini Streaming API

↓

ReadableStream

↓

Return Stream
```

---

# 10. Error Handling Design

## Frontend Errors

### Validation

Empty prompt.

Action:

Return immediately.

### API Failure

Handled using:

```javascript
try {
}
catch(error) {
}
```

### User Experience

Display friendly error bubble.

---

## Backend Errors

### Possible Failures

* Invalid API key.
* Network failure.
* Gemini unavailable.
* SDK exception.

### Strategy

* Log server error.
* Return HTTP 500.
* Do not expose API key.

---

# 11. Sequence Diagram

## End-to-End Streaming Sequence

```text
User

│

│  Enter Prompt

▼

Chat Page

│

│ POST /api/chat

▼

API Route

│

│ generateContentStream()

▼

Gemini

│

│ Chunk 1

│ Chunk 2

│ Chunk 3

▼

ReadableStream

│

▼

Browser Reader

│

▼

Update Last AI Bubble

│

▼

Streaming Complete
```

---

# 12. Environment Configuration

## Environment Variables

| Variable       | Description              |
| -------------- | ------------------------ |
| GEMINI_API_KEY | Google AI Studio API Key |

### Storage

```text
.env.local
```

Never committed to GitHub.

---

# 13. Security Considerations

## API Key Protection

Gemini key remains server-side.

Browser only communicates with:

```http
/api/chat
```

Advantages:

* API key hidden.
* Secure backend communication.
* Centralized request validation.

---

## Client-Server Separation

Frontend responsibilities:

* UI
* State
* Streaming rendering

Backend responsibilities:

* AI communication.
* Stream generation.
* Error handling.

---

# 14. Performance Design

## Current Optimizations

* Streaming responses.
* Component-based rendering.
* Conditional rendering.
* Loading indicator.
* Disabled button during requests.

## Why Streaming Improves UX

Users begin reading before the model finishes generating.

Perceived latency becomes significantly lower.

---

# 15. Extension Points (Phase 5)

Future modules integrate without changing existing chat architecture.

```text
Upload PDF

↓

PDF Parser

↓

Chunk Generator

↓

Embedding Generator

↓

Vector Store

↓

Retriever

↓

Gemini Prompt

↓

Streaming Response
```

The current `sendMessage()` flow remains unchanged except for adding retrieved context before Gemini.

---

# 16. LLD Summary

The AI Study Assistant is implemented using a modular React architecture with a dedicated API layer for Gemini communication. Streaming responses are implemented using the Web Streams API (`ReadableStream`) and consumed on the frontend using `response.body.getReader()`.

The design separates UI components, business logic, and AI communication, making the project maintainable and ready for future RAG integration.
