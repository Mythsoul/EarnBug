"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, RefreshCw, Bot, User, Trash2, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "react-hot-toast"

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I'm EarnBug Assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Filter messages to include system role and proper message formatting
      const messageHistory = [
        { role: "system", content: "You are EarnBug Assistant, an AI helper. Always respond as the assistant only. Never pretend to be the user." },
        ...messages.map(msg => ({
          role: msg.role === "bot" ? "assistant" : "user",
          content: msg.content
        })),
        { role: "user", content: input }
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'EarnBug Assistant'
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-8b-instruct:free",
          messages: messageHistory,
          temperature: 0.7,
          max_tokens: 1000,
          stop: ["User:", "Human:"]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botMessage = {
        role: "bot",
        content: data.choices[0].message.content.trim()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error("Failed to get response. Please try again.");
      
      // Remove the user's message if we failed to get a response
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  // Add chat history persistence
  useEffect(() => {
    // Load chat history on mount
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Update clear chat to also clear localStorage
  const handleClearChat = () => {
    const initialMessage = { 
      role: "bot", 
      content: "Hello! I'm EarnBug Assistant. How can I help you today?" 
    };
    setMessages([initialMessage]);
    localStorage.removeItem('chatHistory');
    toast.success("Chat cleared");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStartRecording = async() => {
  setIsRecording(true)
   toast.success("Recording started") 

   
  }

  const handleStopRecording = () => {
    setIsRecording(false)

    toast.success("Recording stopped")
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">AI Chat Assistant</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Get instant answers and assistance from our intelligent chatbot.
          </p>
        </div>

        <Card className="border border-gray-200 dark:border-gray-800 shadow-lg">
          <CardContent className="p-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-purple-600 mr-2" />
                <span className="font-medium">EarnBug Assistant</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleClearChat}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="h-[500px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message, index) => (
                <div key={index} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start">
                      {message.role === "bot" && (
                        <Bot className="h-5 w-5 mr-2 mt-0.5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      )}
                      <div>{message.content}</div>
                      {message.role === "user" && <User className="h-5 w-5 ml-2 mt-0.5 text-white flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex mb-4 justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                      <RefreshCw className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-grow"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`ml-2 ${isRecording ? "text-red-500" : ""}`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                  className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent> 
        </Card>

     
        
      </div>
    </div>
  )
}

export default ChatBot