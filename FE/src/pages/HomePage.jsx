

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ImageIcon, Mic, MessageSquare, Volume2, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      title: "Image Generation",
      description: "Create stunning images from text descriptions using advanced AI models.",
      icon: <ImageIcon className="h-10 w-10 text-purple-600" />,
      link: "/image-generation",
    },
    {
      title: "Text to Voice",
      description: "Convert your text into natural-sounding speech with multiple voice options.",
      icon: <Volume2 className="h-10 w-10 text-purple-600" />,
      link: "/text-to-voice",
    },
    {
      title: "Voice to Text",
      description: "Accurately transcribe audio recordings and voice inputs into text.",
      icon: <Mic className="h-10 w-10 text-purple-600" />,
      link: "/voice-to-text",
    },
    {
      title: "Chat Bot",
      description: "Engage with our intelligent chatbot for assistance, information, and conversation.",
      icon: <MessageSquare className="h-10 w-10 text-purple-600" />,
      link: "/chatbot",
    },
  ]

  const benefits = [
    "Boost productivity with AI-powered tools",
    "Save time on creative tasks",
    "Generate professional-quality content",
    "Accessible from any device",
    "User-friendly interfaces",
    "Continuous improvements and updates",
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Unlock the Power of AI with</span>
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  EarnBug
                </span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                Transform your ideas into reality with our suite of AI-powered tools for image generation, voice
                conversion, and intelligent conversations.
              </p>
      
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Our AI Services</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Explore our range of powerful AI tools designed to enhance your creativity and productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{feature.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Link to={feature.link}>
                    <Button
                      variant="ghost"
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 p-0"
                    >
                      Try Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Why Choose EarnBug?</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Our platform offers cutting-edge AI tools that are easy to use, reliable, and constantly improving.
              </p>
              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
                    <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/image-generation"><Button   className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Start Creating Now
                </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                    <Sparkles className="h-12 w-12 text-purple-600 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Powered by Advanced AI</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our platform leverages the latest advancements in artificial intelligence to deliver exceptional
                      results for all your creative needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default HomePage