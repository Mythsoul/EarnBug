"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  Volume2,
  Download,
  RefreshCw,
  FileText,
  Sparkles,
  AudioWaveformIcon as Waveform,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CuteLoader from "@/components/Loader"
import toast from "react-hot-toast"

const TextToVoice = () => {
  const [text, setText] = useState("")
  const [voice, setVoice] = useState("David")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [activeTab, setActiveTab] = useState("input")
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef(null)
  const progressIntervalRef = useRef(null)

  const voiceOptions = [
    { value: "David", label: "David (English-US)" },
    { value: "Emma", label: "Emma (English-UK)" },
    { value: "Susan", label: "Susan (English-AU)" },
    { value: "Robert", label: "Robert (English-US)" },
    { value: "Lisa", label: "Lisa (English-UK)" },
  ]

  // Sample texts
  const sampleTexts = [
    {
      title: "Welcome Message",
      text: "Welcome to EarnBug, your all-in-one AI platform for creative content generation.",
    },
    {
      title: "Pangram",
      text: "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet.",
    },
    {
      title: "AI Description",
      text: "Artificial intelligence is transforming how we work, learn, and communicate. The future is here, and it's powered by AI.",
    },
    {
      title: "Thank You Message",
      text: "Thank you for using our service. We hope you found it helpful. Please don't hesitate to contact us if you have any questions or feedback.",
    },
  ]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setAudioDuration(audioRef.current.duration)
      }

      audioRef.current.onended = () => {
        setIsPlaying(false)
        setAudioProgress(0)
        setCurrentTime(0)
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      clearInterval(progressIntervalRef.current)
    }
  }, [audioUrl])

  const updateProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setAudioProgress(progress)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text")
      return
    }

    setIsGenerating(true)
    
    // Try with first API key
    try {
      const response = await fetch("https://talkify.net/api/speech/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": import.meta.env.VITE_TALKIFY_API_KEY,
          Accept: "audio/mp3",
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          format: "mp3",
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const audioUrl = URL.createObjectURL(blob)
        setAudioUrl(audioUrl)
        setActiveTab("output")
        toast.success("Audio generated successfully!")
        return
      }

      // If first key fails, try second key
      toast.error("First attempt failed. Trying backup API key...")
      const retryResponse = await fetch("https://talkify.net/api/speech/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": import.meta.env.VITE_TALKIFY_API_KEY2,
          Accept: "audio/mp3",
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          format: "mp3",
        }),
      })

      if (!retryResponse.ok) {
        throw new Error("Failed to generate audio with both API keys")
      }

      const blob = await retryResponse.blob()
      const audioUrl = URL.createObjectURL(blob)
      setAudioUrl(audioUrl)
      setActiveTab("output")
      toast.success("Audio generated successfully!")
    } catch (err) {
      console.error("Error generating audio:", err)
      toast.error(err.message || "Failed to generate audio. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!audioUrl) return

    const a = document.createElement("a")
    a.href = audioUrl
    a.download = `talkify-audio-${Date.now()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success("Download started!")
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        clearInterval(progressIntervalRef.current)
      } else {
        audioRef.current.play()
        progressIntervalRef.current = setInterval(updateProgress, 100)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSeek = (e) => {
    if (audioRef.current && audioDuration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const clickedValue = (x / rect.width) * 100
      const seekTime = (clickedValue / 100) * audioDuration

      audioRef.current.currentTime = seekTime
      setAudioProgress(clickedValue)
      setCurrentTime(seekTime)
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Badge
            variant="outline"
            className="mb-4 px-3 py-1 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300"
          >
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            AI-Powered
          </Badge>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            Text to Voice Conversion
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Convert your text into natural-sounding speech with our AI voice generator.
          </p>
        </div>

        <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="input" className="text-sm sm:text-base">
              <FileText className="mr-2 h-4 w-4" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="output" className="text-sm sm:text-base" disabled={!audioUrl}>
              <Volume2 className="mr-2 h-4 w-4" />
              Audio Output
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                  <CardHeader>
                    <CardTitle>Text to Convert</CardTitle>
                    <CardDescription>Enter the text you want to convert to speech</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="text" className="text-base font-medium">
                          Text Content
                        </Label>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{text.length} characters</span>
                      </div>
                      <Textarea
                        id="text"
                        placeholder="Enter the text you want to convert to speech..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="h-40 resize-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <Label htmlFor="voice" className="text-base font-medium">
                        Voice
                      </Label>
                      <Select value={voice} onValueChange={setVoice}>
                        <SelectTrigger
                          id="voice"
                          className="mt-1.5 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                        >
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {voiceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center">
                          <span className="mr-3">Generating...</span>
                        </div>
                      ) : (
                        <>
                          <Volume2 className="mr-2 h-5 w-5" />
                          Generate Speech
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>


    <div className="lg:col-span-1 space-y-6">
                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Waveform className="h-5 w-5 mr-2 text-green-500" />
                      Voice Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-2">
                      {voiceOptions.map((voiceOption) => (
                        <div
                          key={voiceOption.value}
                          className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                            voice === voiceOption.value
                              ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                              : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                          onClick={() => setVoice(voiceOption.value)}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                voice === voiceOption.value ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-700"
                              } mr-2`}
                            ></div>
                            <span>{voiceOption.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="output" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Audio Player Section */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Generated Audio</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setActiveTab("input")}>
                        Edit Text
                      </Button>
                    </div>
                    <CardDescription>Listen to your generated audio or download it</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    {audioUrl && (
                      <div className="flex-grow flex flex-col">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg overflow-hidden flex-grow flex flex-col items-center justify-center p-8">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-6">
                            <Volume2 className="h-16 w-16 text-white" />
                          </div>

                          <audio ref={audioRef} src={audioUrl} className="hidden" />

                          <div className="w-full max-w-md">
                            <div
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer mb-2"
                              onClick={handleSeek}
                            >
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                style={{ width: `${audioProgress}%` }}
                              ></div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-6">
                              <span>{formatTime(currentTime)}</span>
                              <span>{formatTime(audioDuration)}</span>
                            </div>

                            <div className="flex justify-center space-x-4">
                              <Button
                                onClick={handlePlayPause}
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full border-2 border-purple-500 dark:border-purple-400"
                              >
                                {isPlaying ? (
                                  <Pause className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                ) : (
                                  <Play className="h-6 w-6 text-purple-600 dark:text-purple-400 ml-0.5" />
                                )}
                              </Button>
                              <Button
                                onClick={handleDownload}
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full border-2 border-purple-500 dark:border-purple-400"
                              >
                                <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
                    <div className="w-full flex flex-wrap justify-between items-center gap-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                        >
                          {voiceOptions.find((v) => v.value === voice)?.label}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerate}
                        className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Text Preview Section */}
              <div className="space-y-6">
                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      Text Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {text || "No text provided"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                      What's Next?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Download your audio for use in projects</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Try different voices for variety</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Use for presentations, videos, or podcasts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Create audio content for your website</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl">
              <CuteLoader variant="cat" size="lg" text="Generating audio..." />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextToVoice
