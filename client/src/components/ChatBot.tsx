import React, { useState } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I can help you find events or create new ones. What would you like to do?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Send user input to backend
      const response = await fetch("http://localhost:4001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bot response.");
      }

      const data = await response.json();

      // Append bot's response
      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.reply,
        isBot: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Error fetching response from bot.");
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      toast("👋 How can I help you today?", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 left-4 p-4 bg-cream-100 text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-4 left-4 w-96 bg-black rounded-2xl shadow-2xl transition-all duration-300 z-50 border border-white/50 ${
          isOpen
            ? "scale-100 opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="border-b border-white/20 bg-black text-green-500 font-mono">
          <pre className="text-center p-2 text-xs">
            {`
 █    █ ████████  ████  ████  ███  ████ 
 █    █    ██    █    █ █   █  █  █   █
 █    █    ██    █    █ █▄▄▄█  █  █▄▄▄█
 █    █    ██    █    █ █      █  █   █
  █▄▄█     ██     ████  █      █  █   █
`}
          </pre>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold">$ event-assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 font-mono">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div className={`max-w-[80%] p-3 text-white`}>
                {message.isBot ? "ai$ " : "user$ "}
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="text-white">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center space-x-2">
            <span className="text-green-500 font-mono">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Enter command..."
              className="flex-1 p-2 bg-black text-white font-mono border-none focus:outline-none focus:ring-0 placeholder-white/30"
            />
            <button
              onClick={handleSend}
              className="text-white/70 hover:text-white transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
