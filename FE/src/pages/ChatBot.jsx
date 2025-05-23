"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, MicOff, Bot, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CuteLoader from "@/components/Loader"
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
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Filter messages to include system role and proper message formatting
      const messageHistory = [
        {
          role: "system",
          content:
            "You are EarnBug Assistant, an AI helper. Always respond as the assistant only. Never pretend to be the user.",
        },
        ...messages.map((msg) => ({
          role: msg.role === "bot" ? "assistant" : "user",
          content: msg.content,
        })),
        { role: "user", content: input },
      ]

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "EarnBug Assistant",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-8b-instruct:free",
          messages: messageHistory,
          temperature: 0.7,
          max_tokens: 1000,
          stop: ["User:", "Human:"],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      const botMessage = {
        role: "bot",
        content: data.choices[0].message.content.trim(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      toast.error("Failed to get response. Please try again.")

      // Remove the user's message if we failed to get a response
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  // Add chat history persistence
  useEffect(() => {
    // Load chat history on mount
    const savedMessages = localStorage.getItem("chatHistory")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save messages whenever they change
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages))
  }, [messages])

  // Update clear chat to also clear localStorage
  const handleClearChat = () => {
    const initialMessage = {
      role: "bot",
      content: "Hello! I'm EarnBug Assistant. How can I help you today?",
    }
    setMessages([initialMessage])
    localStorage.removeItem("chatHistory")
    toast.success("Chat cleared")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStartRecording = async () => {
    setIsRecording(true)
    toast.success("Recording started")
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    toast.success("Recording stopped")
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300"
          >
            <Bot className="mr-1 h-3.5 w-3.5" />
            AI-Powered
          </Badge>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            AI Chat Assistant
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Get instant answers and assistance from our intelligent chatbot.
          </p>
        </div>

        <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 bg-gradient-to-br from-purple-500 to-pink-500">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>EarnBug Assistant</CardTitle>
                <CardDescription>Powered by AI</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearChat} className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear Chat</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50">
              {messages.map((message, index) => (
                <div key={index} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === "bot" && (
                        <Avatar className="h-6 w-6 mt-0.5 bg-gradient-to-br from-purple-500 to-pink-500">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`whitespace-pre-wrap ${message.role === "bot" ? "text-gray-800 dark:text-gray-200" : ""}`}
                      >
                        {message.content}
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-6 w-6 mt-0.5 bg-gray-300 dark:bg-gray-600">
                          <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex mb-4 justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 bg-gradient-to-br from-purple-500 to-pink-500">
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <CuteLoader variant="duck" size="sm" text="" showText={false} />
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
                  className="flex-grow focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`ml-2 ${isRecording ? "text-red-500 animate-pulse" : ""}`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-gray-200 dark:border-gray-800 py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
            <p>
              EarnBug Assistant can make mistakes. Consider checking important information. Your conversations are saved
              locally.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ChatBot
