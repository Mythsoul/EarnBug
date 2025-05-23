import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ImageIcon,
  Mic,
  MessageSquare,
  Volume2,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Zap,
  Brain,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)

    // Auto-rotate featured cards
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: "Image Generation",
      description: "Create stunning images from text descriptions using advanced AI models.",
      icon: <ImageIcon className="h-10 w-10 text-primary" />,
      link: "/image-generation",
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Text to Voice",
      description: "Convert your text into natural-sounding speech with multiple voice options.",
      icon: <Volume2 className="h-10 w-10 text-primary" />,
      link: "/text-to-voice",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Voice to Text",
      description: "Accurately transcribe audio recordings and voice inputs into text.",
      icon: <Mic className="h-10 w-10 text-primary" />,
      link: "/voice-to-text",
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Chat Bot",
      description: "Engage with our intelligent chatbot for assistance, information, and conversation.",
      icon: <MessageSquare className="h-10 w-10 text-primary" />,
      link: "/chatbot",
      color: "from-amber-500 to-orange-500",
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
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-violet-950/30 dark:to-purple-950/20 -z-10" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-300/20 dark:bg-pink-700/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-violet-300/20 dark:bg-violet-700/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                  <Zap className="mr-1 h-3.5 w-3.5" />
                  AI-Powered Tools
                </span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">Unlock the Power of AI with</span>
                <span className="block mt-2 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-transparent bg-clip-text">
                  EarnBug
                </span>
              </h1>

              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                Transform your ideas into reality with our suite of AI-powered tools for image generation, voice
                conversion, and intelligent conversations.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/image-generation">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button size="lg" variant="outline" className="border-purple-200 dark:border-purple-800 shadow-lg">
                    Try AI Chat
                    <MessageSquare className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 mb-4">
              <Brain className="mr-1 h-3.5 w-3.5" />
              Our Services
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              AI Tools for Every Need
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Explore our range of powerful AI tools designed to enhance your creativity and productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`border border-gray-200 dark:border-gray-800 overflow-hidden ${
                  activeFeature === index ? "ring-2 ring-purple-500 dark:ring-purple-400 shadow-lg" : ""
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0`} />

                <CardHeader>
                  <div className="mb-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 inline-flex">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-400">{feature.description}</CardDescription>
                </CardContent>

                <CardFooter>
                  <Link to={feature.link} className="w-full">
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white">
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
      <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/10 dark:bg-purple-700/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300/10 dark:bg-pink-700/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 mb-4">
                <Star className="mr-1 h-3.5 w-3.5" />
                Why Choose Us
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Why Choose EarnBug?</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Our platform offers cutting-edge AI tools that are easy to use, reliable, and constantly improving.
              </p>
              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/image-generation">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                  >
                    Start Creating Now
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-12 lg:mt-0 flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
                    <Sparkles className="h-12 w-12 text-purple-600 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Powered by Advanced AI</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our platform leverages the latest advancements in artificial intelligence to deliver exceptional
                      results for all your creative needs.
                    </p>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">
                            JD
                          </div>
                          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">
                            AK
                          </div>
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            RN
                          </div>
                        </div>
                        <div className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">1,000+</span> users already creating with EarnBug
                        </div>
                      </div>
                    </div>
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
          animation: blob 15s infinite;
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
