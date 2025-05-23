"use client"

import { useState, useRef, useEffect } from "react"
import {
  Mic,
  MicOff,
  FileAudio,
  Copy,
  Check,
  Upload,
  AudioWaveformIcon as Waveform,
  Clock,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import CuteLoader from "@/components/Loader"
import toast from "react-hot-toast"

const VoiceToText = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [language, setLanguage] = useState("en_us")
  const [audioFile, setAudioFile] = useState(null)
  const [copied, setCopied] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingProgress, setRecordingProgress] = useState(0)
  const fileInputRef = useRef(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const timerRef = useRef(null)

  const languageOptions = [
    { value: "en_us", label: "English (US)" },
    { value: "en_uk", label: "English (UK)" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "nl", label: "Dutch" },
    { value: "hi", label: "Hindi" },
    { value: "ja", label: "Japanese" },
  ]

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1
          // Calculate progress as percentage of 2 minutes (120 seconds)
          setRecordingProgress(Math.min((newTime / 120) * 100, 100))
          return newTime
        })
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/mp3" })
        await handleTranscription(audioBlob)
      }

      setMediaRecorder(recorder)
      setAudioChunks(chunks)
      recorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setRecordingProgress(0)
      toast.success("Recording started!")
    } catch (err) {
      console.error("Error starting recording:", err)
      toast.error("Could not access microphone")
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      toast.success("Recording stopped")
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setAudioFile(file)
    await handleTranscription(file)
  }

  const handleTranscription = async (audioFile) => {
    setIsTranscribing(true)
    try {
      const tryTranscription = async (apiKey) => {
        // Upload audio file
        const uploadUrl = "https://api.assemblyai.com/v2/upload"
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: apiKey,
          },
          body: audioFile,
        })

        if (!uploadResponse.ok) throw new Error("Upload failed")
        const { upload_url } = await uploadResponse.json()
        toast.success("Audio uploaded successfully!")

        // Request transcription
        const transcribeUrl = "https://api.assemblyai.com/v2/transcript"
        const transcribeResponse = await fetch(transcribeUrl, {
          method: "POST",
          headers: {
            Authorization: apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audio_url: upload_url,
            language_code: language,
          }),
        })

        if (!transcribeResponse.ok) throw new Error("Transcription request failed")
        const { id: transcriptId } = await transcribeResponse.json()

        // Poll for results
        while (true) {
          const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
            headers: { Authorization: apiKey },
          })

          if (!pollingResponse.ok) throw new Error("Polling failed")
          const result = await pollingResponse.json()

          if (result.status === "completed") {
            setTranscribedText(result.text)
            toast.success("Transcription complete!")
            return true
          } else if (result.status === "error") {
            throw new Error(result.error)
          }

          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      // Try with first API key
      try {
        const success = await tryTranscription(import.meta.env.VITE_ASSEMBLYAI_API_KEY)
        if (success) return
      } catch (error) {
        console.error("First API key failed:", error)
        toast.error("First attempt failed. Trying backup API key...")
      }

      // Try with second API key
      try {
        await tryTranscription(import.meta.env.VITE_ASSEMBLYAI_API_KEY2)
      } catch (error) {
        throw new Error("Both API keys failed . Please try again later.")
      }

    } catch (err) {
      console.error("Transcription error:", err)
      toast.error(err.message || "Failed to transcribe audio")
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleCopyText = () => {
    if (transcribedText) {
      navigator.clipboard.writeText(transcribedText)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
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
            Voice to Text Conversion
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Convert speech to text with our accurate AI transcription service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
              <CardHeader>
                <CardTitle>Audio Input</CardTitle>
                <CardDescription>Record or upload audio to transcribe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="language" className="text-base font-medium">
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      id="language"
                      className="mt-1.5 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Record Audio</Label>
                    <div className="flex flex-col items-center">
                      <Button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        className={`h-24 w-24 rounded-full shadow-lg ${
                          isRecording
                            ? "bg-red-500 hover:bg-red-600 animate-pulse"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        }`}
                      >
                        {isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                      </Button>
                      <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
                        {isRecording ? "Click to stop recording" : "Click to start recording"}
                      </p>

                      {isRecording && (
                        <div className="w-full mt-4">
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-red-500 mr-1.5" />
                              <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                            >
                              <Waveform className="h-3 w-3 mr-1 animate-pulse" />
                              Recording
                            </Badge>
                          </div>
                          <Progress value={recordingProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Upload Audio File</Label>
                    <Button
                      variant="outline"
                      className="w-full h-20 border-dashed border-2 hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-6 w-6 mb-2 text-purple-500 dark:text-purple-400" />
                        <span>{audioFile ? audioFile.name : "Click to upload audio file"}</span>
                      </div>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="audio/*"
                      className="hidden"
                    />
                    <p className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Supports MP3, WAV, M4A, FLAC (max 10MB)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2"></div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Waveform className="h-5 w-5 mr-2 text-amber-500" />
                  Tips for Better Transcription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Speak clearly and at a moderate pace</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Minimize background noise when recording</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Use a good quality microphone if possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>Select the correct language for better accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span>For longer recordings, consider uploading an audio file</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div>
            <Card className="h-full flex flex-col border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Transcribed Text</CardTitle>
                  {transcribedText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyText}
                      className="text-purple-600 dark:text-purple-400"
                    >
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </div>
                <CardDescription>Your transcribed text will appear here</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {isTranscribing ? (
                  <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
                    <CuteLoader variant="bunny" size="lg" text="Transcribing your audio..." />
                  </div>
                ) : transcribedText ? (
                  <div className="flex-grow flex flex-col">
                    <Textarea
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                      className="flex-grow min-h-[300px] resize-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                    />
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8">
                    <FileAudio className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Your transcribed text will appear here
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
                      Record or upload audio to get started
                    </p>
                  </div>
                )}
              </CardContent>
              {transcribedText && (
                <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {languageOptions.find((l) => l.value === language)?.label}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      >
                        {audioFile ? "Uploaded File" : "Voice Recording"}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTranscribedText("")
                        setAudioFile(null)
                      }}
                      size="sm"
                    >
                      Clear
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceToText
