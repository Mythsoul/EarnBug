import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, Download, RefreshCw, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import toast from "react-hot-toast"

const TextToVoice = () => {
  const [text, setText] = useState("")
  const [voice, setVoice] = useState("David") // Changed from "female-1" to "David"
  const [speed, setSpeed] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const audioRef = useRef(null)

  const voiceOptions = [
    { value: "David", label: "David (English-US)" },
    { value: "Emma", label: "Emma (English-UK)" },
    { value: "Susan", label: "Susan (English-AU)" },
    { value: "Robert", label: "Robert (English-US)" },
    { value: "Lisa", label: "Lisa (English-UK)" }
  ]

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('https://talkify.net/api/speech/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_TALKIFY_API_KEY,
          'Accept': 'audio/mp3'
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          format: 'mp3',
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl);
      toast.success("Audio generated successfully!");
    } catch (err) {
      console.error("Error generating audio:", err);
      toast.error("Error generating audio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `talkify-audio-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Download started!");
  }

  // Clean up object URL when component unmounts or when new audio is generated
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Text to Voice Conversion
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Convert your text into natural-sounding speech with our AI voice generator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text">Text to Convert</Label>
                    <Textarea
                      id="text"
                      placeholder="Enter the text you want to convert to speech..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="h-40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="voice">Voice</Label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger id="voice">
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

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="speed">Speed: {speed.toFixed(1)}x</Label>
                    </div>
                    <Slider
                      id="speed"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[speed]}
                      onValueChange={(value) => setSpeed(value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="pitch">Pitch: {pitch.toFixed(1)}</Label>
                    </div>
                    <Slider
                      id="pitch"
                      min={0.5}
                      max={2}
                      step={0.1}
                      value={[pitch]}
                      onValueChange={(value) => setPitch(value[0])}
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Volume2 className="mr-2 h-4 w-4" />
                        Generate Speech
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Sample Texts</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() =>
                      setText("Welcome to EarnBug, your all-in-one AI platform for creative content generation.")
                    }
                  >
                    <span className="truncate">Welcome message</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() =>
                      setText(
                        "The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet.",
                      )
                    }
                  >
                    <span className="truncate">Pangram</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2"
                    onClick={() =>
                      setText(
                        "Artificial intelligence is transforming how we work, learn, and communicate. The future is here, and it's powered by AI.",
                      )
                    }
                  >
                    <span className="truncate">AI description</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div>
            <Card className="h-full flex flex-col">
              <CardContent className="pt-6 flex-grow flex flex-col">
                <h3 className="text-lg font-medium mb-4">Generated Audio</h3>

                {audioUrl ? (
                  <div className="flex-grow flex flex-col">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 flex-grow flex flex-col items-center justify-center">
                      <Volume2 className="h-16 w-16 text-purple-600 mb-4" />

                      <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mb-6">
                        <div
                          className="bg-purple-600 h-full rounded-full"
                          style={{ width: isPlaying ? "60%" : "0%", transition: "width 0.3s linear" }}
                        ></div>
                      </div>

                      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />

                      <div className="flex space-x-4">
                        <Button
                          onClick={handlePlayPause}
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-full"
                        >
                          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                        </Button>
                        <Button
                          onClick={handleDownload}
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-full"
                        >
                          <Download className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Voice: {voiceOptions.find((v) => v.value === voice)?.label}
                        {" • "}
                        Speed: {speed.toFixed(1)}x{" • "}
                        Pitch: {pitch.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
                    <FileText className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Your generated audio will appear here
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
                      Enter text and click "Generate Speech" to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextToVoice