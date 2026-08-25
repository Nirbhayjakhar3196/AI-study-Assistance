"use client";

import { useState } from "react";

import ChatHeader from "@/components/ChatHeader";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import LoadingBubble from "@/components/LoadingBubble";
import EmptyChat from "@/components/EmptyChat";

export default function ChatPage() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    async function sendMessage() {
        if (!message.trim()) return;

        const userMessage = {
            role: "user",
            text: message,
        };

        setMessages((prevMessages) => [
            ...prevMessages,
            userMessage,
        ]);

        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    message: userMessage.text,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to get response from Gemini");
            }

            const reader = res.body.getReader();

            const aiMessage = {
                role: "ai",
                text: "",
            }

            setMessages((prevMessages) => [...prevMessages , aiMessage]);

            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value);

                setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];

                    updatedMessages[updatedMessages.length - 1] = {
                    ...updatedMessages[updatedMessages.length - 1],
                    text:
                        updatedMessages[updatedMessages.length - 1].text + chunk,
                    };

                    return updatedMessages;
                })
            }

            setLoading(false)

        } catch (error) {
            console.error("Chat Error:", error);

            const errorMessage = {
                role: "ai",
                text: "⚠ Sorry, I couldn't generate a response. Please try again.",
            };

            setMessages((prevMessages) => [
                ...prevMessages,
                errorMessage,
            ]);

        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col">

            <ChatHeader />

            <section className="flex-1 p-6">
                <div className="max-w-3xl mx-auto space-y-4">

                    {messages.length === 0 && !loading && (
                        <EmptyChat />
                    )}

                    {messages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            message={msg}
                        />
                    ))}

                    {loading && (
                        <LoadingBubble />
                    )}

                </div>
            </section>

            <ChatInput
                message={message}
                setMessage={setMessage}
                sendMessage={sendMessage}
                loading={loading}
            />

        </main>
    );
}