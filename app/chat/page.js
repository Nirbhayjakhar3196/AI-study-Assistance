"use client";

import { useState } from "react"



export default function ChatPage() {

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false)

    async function sendMessage(){

        if(!message.trim()) return;

        const userMessage = {
            role: "user",
            text: message
        }

        setMessages((prevMessages) => [...prevMessages,userMessage])

        setMessage("");

        setLoading(true)

        try {
            const res = await fetch("/api/chat" , {
                method: "POST",

                headers: {
                    "Content-Type" : "application/json",
                },

                body : JSON.stringify({
                    message:userMessage.text
                })
            })

            if(!res.ok){
                throw new Error("Failed to get response from Gemini")
            }

            const data = await res.json();

            const aiMessage = {
                role : "ai",
                text : data.reply
            }
        } catch (error) {
            console.error("Chat Error: " , error)
            
            const errorMessage = {
                role: "ai",
                text: "⚠ Sorry, I couldn't generate a response. Please try again."
            }
        }

        setMessages((prevMessages) => [...prevMessages , aiMessage])

        setLoading(false)
    }

    return (
        
        <main className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow p-4">
                <h1 className="text-2xl font-bold">
                    AI Study Assistant
                </h1>
            </header>

            <section className="flex-1 p-6">
                <div className="max-w-3xl mx-auto space-y-4">

                    {messages.map((msg ,index) => (
                        <div
                            key={index}
                            className={
                                msg.role === "user"
                                ? "bg-blue-500 text-white p-3 rounded-xl ml-auto w-fit max-w-sm"
                                : "bg-white p-3 rounded-xl w-fit max-w-sm shadow"
                            }
                        >
                            {msg.text}
                            
                        </div>
                    ))}

                    {loading && (
                        <div className="bg-gray-200 p-3 rounded-xl w-fit max-w-sm">
                            😎Gemini is Thinking...
                        </div>
                    )}

                </div>
            </section>

            <footer className="bg-white border-t p-4">
                <div className="max-w-3xl mx-auto flex gap-2">
                <input
                    type="text"
                    value = {message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 border rounded-lg px-4 py-2"
                />

                <button 
                    onClick={sendMessage}
                    className="bg-black text-white px-5 rounded-lg">
                    {loading ? "Thinking.." : 'Send'}
                </button>
                </div>
            </footer>

        </main>

    )

}