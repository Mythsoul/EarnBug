"use client"

import { useState } from "react"
import { Download, RefreshCw, ImageIcon, Wand2, Sparkles, Info, Lightbulb, Palette } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import CuteLoader from "@/components/Loader"
import axios from "axios"

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [style, setStyle] = useState("photographic")
  const [size, setSize] = useState("512x512")
  const [steps, setSteps] = useState(30)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [aimodel, setAimodel] = useState("Normal")
  const [activeTab, setActiveTab] = useState("generate")

  const modelEndpoints = {
    Ultra: import.meta.env.VITE_STABILITY_API_URL + "/ultra",
    Normal: import.meta.env.VITE_STABILITY_API_URL + "/core",
    Medium: import.meta.env.VITE_STABILITY_API_URL + "/sd3",
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    try {
      const payload = new FormData()
      payload.append("prompt", prompt)
      payload.append("output_format", "webp")
      payload.append("style_preset", style)
      payload.append("width", Number.parseInt(size.split("x")[0]))
      payload.append("height", Number.parseInt(size.split("x")[1]))
      payload.append("steps", steps)

      if (negativePrompt) {
        payload.append("negative_prompt", negativePrompt)
      }

      // Try with first API key
      try {
        const response = await axios({
          method: "post",
          url: modelEndpoints[aimodel],
          data: payload,
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
            Accept: "image/*",
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
          withCredentials: false,
        })

        if (response.status === 200) {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ""),
          )
          setGeneratedImage(`data:image/webp;base64,${base64Image}`)
          toast.success("Image generated successfully!")
          setActiveTab("result")
          return
        }
      } catch (error) {
        if (error.response?.status !== 402) throw error
      }

      // Try with second API key
      toast.error("API quota exceeded. Trying again")
      try {
        const response = await axios({
          method: "post",
          url: modelEndpoints[aimodel],
          data: payload,
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_STABILITY_API_KEY2}`,
            Accept: "image/*",
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
          withCredentials: false,
        })

        if (response.status === 200) {
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ""),
          )
          setGeneratedImage(`data:image/webp;base64,${base64Image}`)
          toast.success("Image generated successfully!")
          setActiveTab("result")
          return
        }
      } catch (error) {
        if (error.response?.status !== 402) throw error
      }

      // Try with third API key
      toast.error("API quota exceeded. Trying one last time")
      const finalResponse = await axios({
        method: "post",
        url: modelEndpoints[aimodel],
        data: payload,
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_STABILITY_API_KEY3}`,
          Accept: "image/*",
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
        withCredentials: false,
      })

      if (finalResponse.status === 200) {
        const base64Image = btoa(
          new Uint8Array(finalResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ""),
        )
        setGeneratedImage(`data:image/webp;base64,${base64Image}`)
        toast.success("Image generated successfully!")
        setActiveTab("result")
        return
      }

      throw new Error("Api quota exceeded . Please try again later cause i am broke : > ");   
    } catch (err) {
      console.error("Error generating image:", err)
      toast.error(err.message || "Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    try {
      if (!generatedImage) {
        toast.error("No image to download")
        return
      }

      // Create temporary link to download
      const link = document.createElement("a")
      link.href = generatedImage
      link.download = `generated-image-${Date.now()}.webp`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Download started")
    } catch (err) {
      console.error("Download error:", err)
      toast.error("Failed to download image")
    }
  }

  const styleOptions = [
    { value: "photographic", label: "Photographic" },
    { value: "digital-art", label: "Digital Art" },
    { value: "anime", label: "Anime" },
    { value: "comic-book", label: "Comic Book" },
    { value: "fantasy-art", label: "Fantasy Art" },
    { value: "analog-film", label: "Analog Film" },
    { value: "pixel-art", label: "Pixel Art" },
    { value: "neon-punk", label: "Neon Punk" },
    { value: "isometric", label: "Isometric" },
    { value: "line-art", label: "Line Art" },
    { value: "origami", label: "Origami" },
    { value: "3d-model", label: "3D Model" },
  ]

  const sizeOptions = [
    { value: "512x512", label: "512x512" },
    { value: "768x768", label: "768x768" },
    { value: "1024x1024", label: "1024x1024" },
    { value: "1024x768", label: "1024x768 (Landscape)" },
    { value: "768x1024", label: "768x1024 (Portrait)" },
  ]

  const promptSuggestions = [
    "A serene landscape with mountains and a lake at sunset",
    "A futuristic cityscape with flying cars and neon lights",
    "A magical forest with glowing mushrooms and fairy lights",
    "An underwater scene with colorful coral reefs and exotic fish",
    "A cozy cabin in the woods during winter with snow falling",
  ]

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
            AI Image Generation
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Transform your ideas into stunning visuals with our AI-powered image generator.
          </p>
        </div>

        <Tabs defaultValue="generate" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="text-sm sm:text-base">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="result" className="text-sm sm:text-base" disabled={!generatedImage}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="overflow-hidden border-purple-100 dark:border-purple-900/50 shadow-lg">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="prompt" className="text-base font-medium">
                            Prompt
                          </Label>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{prompt.length} characters</span>
                        </div>
                        <Textarea
                          id="prompt"
                          placeholder="Describe the image you want to generate in detail..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="h-32 resize-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                          {promptSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => setPrompt(suggestion)}
                              className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors"
                            >
                              {suggestion.length > 30 ? suggestion.substring(0, 30) + "..." : suggestion}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="negative-prompt" className="text-base font-medium">
                          Negative Prompt (Optional)
                        </Label>
                        <Textarea
                          id="negative-prompt"
                          placeholder="Elements you want to exclude from the image..."
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                          className="h-20 resize-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="aimodel" className="text-base font-medium">
                            AI Model
                          </Label>
                          <Select value={aimodel} onValueChange={setAimodel}>
                            <SelectTrigger
                              id="aimodel"
                              className="focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                            >
                              <SelectValue placeholder="Select AI Model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ultra">Ultra Quality</SelectItem>
                              <SelectItem value="Medium">Medium Quality</SelectItem>
                              <SelectItem value="Normal">Normal Quality</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="style" className="text-base font-medium">
                            Style
                          </Label>
                          <Select value={style} onValueChange={setStyle}>
                            <SelectTrigger
                              id="style"
                              className="focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                            >
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              {styleOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="size" className="text-base font-medium">
                            Size
                          </Label>
                          <Select value={size} onValueChange={setSize}>
                            <SelectTrigger
                              id="size"
                              className="focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
                            >
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {sizeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="steps" className="text-base font-medium">
                            Generation Steps: {steps}
                          </Label>
                        </div>
                        <Slider
                          id="steps"
                          min={10}
                          max={50}
                          step={1}
                          value={[steps]}
                          onValueChange={(value) => setSteps(value[0])}
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Faster</span>
                          <span>Higher Quality</span>
                        </div>
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
                            <Wand2 className="mr-2 h-5 w-5" />
                            Generate Image
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tips Section */}
              <div className="space-y-6">
                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="text-lg font-medium">Tips for Better Results</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Be specific about what you want to see in the image</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Include details about style, lighting, and composition</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Use negative prompts to exclude unwanted elements</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Experiment with different styles and settings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Higher step counts generally produce better quality but take longer</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2"></div>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Palette className="h-5 w-5 text-emerald-500 mr-2" />
                      <h3 className="text-lg font-medium">Style Examples</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {styleOptions.slice(0, 6).map((styleOption) => (
                        <button
                          key={styleOption.value}
                          onClick={() => setStyle(styleOption.value)}
                          className={`p-2 rounded-lg text-xs text-center transition-all ${
                            styleOption.value === style
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 font-medium"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                          }`}
                        >
                          {styleOption.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

          
              </div>
            </div>
          </TabsContent>

          <TabsContent value="result" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Result Section */}
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                  <CardContent className="pt-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Generated Image</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("generate")}>
                          Edit Settings
                        </Button>
                      </div>
                    </div>

                    {generatedImage && (
                      <div className="flex-grow flex flex-col">
                        <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-grow flex items-center justify-center p-4">
                          <img
                            src={generatedImage || "/placeholder.svg"}
                            alt="Generated image"
                            className="max-w-full max-h-[70vh] object-contain rounded-md shadow-lg"
                          />
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 justify-between">
                          <div>
                            <Button variant="outline" onClick={handleGenerate} className="mr-2">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Regenerate
                            </Button>
                            <Button
                              onClick={handleDownload}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Badge variant="outline" className="mr-2">
                              {size}
                            </Badge>
                            <Badge variant="outline" className="mr-2">
                              {styleOptions.find((s) => s.value === style)?.label || style}
                            </Badge>
                            <Badge variant="outline">{aimodel} Model</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Image Details */}
              <div className="space-y-6">
                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2"></div>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Image Details</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prompt</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          {prompt || "No prompt provided"}
                        </p>
                      </div>

                      {negativePrompt && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Negative Prompt</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            {negativePrompt}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{aimodel}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Style</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {styleOptions.find((s) => s.value === style)?.label || style}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{size}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Steps</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{steps}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-100 dark:border-purple-900/50 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                      <h3 className="text-lg font-medium">What's Next?</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Download your image for use in projects</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Try different styles and settings for variations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Refine your prompt for more specific results</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Share your creation on social media</span>
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
              <CuteLoader variant="blob" size="lg" text="Generating image..." />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGeneration
