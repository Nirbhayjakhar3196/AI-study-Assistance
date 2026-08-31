# 🧠 AI Study Assistant

An AI-powered study assistant built with **Next.js 15**, **Gemini 2.5 Flash**, and **Tailwind CSS**.

This project demonstrates how to build a production-style AI chatbot with **streaming responses**, reusable React components, and scalable architecture for future Retrieval-Augmented Generation (RAG).

---

## 🚀 Project Overview

AI Study Assistant helps students ask technical questions about DSA, DBMS, Operating Systems, Java, and other computer science topics using Google's Gemini model.

Unlike a traditional chatbot, this project implements **real-time streaming responses**, making the conversation feel fast and interactive, similar to ChatGPT.

### ✨ Key Highlights

* Real-time AI chat using Gemini 2.5 Flash.
* Streaming responses (text appears while AI generates).
* Clean React component architecture.
* Loading state and graceful error handling.
* Ready for future RAG implementation using uploaded notes/PDFs.

---

## 🎯 Features

### AI Chat

* Ask any programming or CS-related question.
* Powered by Gemini AI.
* Context-aware conversation structure.

### Streaming Responses

* Token-by-token response rendering.
* Smooth user experience.
* Uses Web Streams API.

### Modern UI

* ChatGPT-inspired interface.
* Responsive layout.
* Tailwind CSS styling.

### Robust UX

* Loading indicator.
* Disabled send button while AI responds.
* Error handling for failed API requests.

---

## 🛠 Tech Stack

| Technology              | Purpose                    |
| ----------------------- | -------------------------- |
| Next.js 15 (App Router) | Full-stack React framework |
| JavaScript              | Application logic          |
| Tailwind CSS            | Styling                    |
| Gemini 2.5 Flash        | Large Language Model       |
| Google GenAI SDK        | Gemini integration         |
| Web Streams API         | Streaming responses        |

---

## 📁 Folder Structure

```
ai-study-assistant/
│
├── app/
│   ├── chat/
│   │   └── page.js
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
└── .env.local
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <your-repository-url>
cd ai-study-assistant
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create `.env.local`

```env
GEMINI_API_KEY=your_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Application runs on:

```
http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable       | Description              |
| -------------- | ------------------------ |
| GEMINI_API_KEY | Google AI Studio API Key |

---

## 🔄 Streaming Response Flow

1. User submits a prompt.
2. Frontend sends a POST request to `/api/chat`.
3. Backend calls `generateContentStream()`.
4. Gemini streams chunks.
5. Backend forwards chunks using `ReadableStream`.
6. Frontend reads chunks using `getReader()`.
7. Last AI message updates continuously.

---

##  Concepts Implemented

### React

* Components
* Props
* State Management
* Conditional Rendering
* Event Handling

### Next.js

* App Router
* API Routes
* Server Components
* Client Components

### AI Engineering

* Gemini API Integration
* Streaming Responses
* Loading State
* Error Handling
* Web Streams API

---

## 🧩 Future Roadmap

* [x] Gemini Chat Integration
* [x] Streaming Responses
* [ ] PDF Upload
* [ ] Retrieval-Augmented Generation (RAG)
* [ ] Conversation History
* [ ] Markdown Rendering
* [ ] Syntax Highlighting
* [ ] Chat Persistence
* [ ] Vector Database Integration

---

## 🎓 What I Learned

This project helped me understand:

* Building AI applications using Gemini.
* Full-stack development with Next.js.
* Streaming architecture using Web Streams API.
* Clean React component architecture.
* API design and error handling.

---

## 👨‍💻 Author

**Nirbhay Jakhar**

Built as part of my AI Engineering + Full Stack learning journey.
