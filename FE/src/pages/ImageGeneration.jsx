
import { useState } from "react"
import { Download, RefreshCw, ImageIcon, Wand2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ImageGeneration = () => {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [style, setStyle] = useState("realistic")
  const [size, setSize] = useState("1024x1024")
  const [steps, setSteps] = useState(30)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }

    setIsGenerating(true)

    // Simulate image generation
    setTimeout(() => {
      setGeneratedImage(`/placeholder.svg?height=512&width=512&text=Generated+Image`)
      setIsGenerating(false)

      alert("Image generated successfully");
    }, 2000)
  }

  const handleDownload = () => {
    alert("Download started");
  }

  const styleOptions = [
    { value: "realistic", label: "Realistic" },
    { value: "anime", label: "Anime" },
    { value: "digital-art", label: "Digital Art" },
    { value: "oil-painting", label: "Oil Painting" },
    { value: "watercolor", label: "Watercolor" },
    { value: "pixel-art", label: "Pixel Art" },
  ]

  const sizeOptions = [
    { value: "512x512", label: "512x512" },
    { value: "768x768", label: "768x768" },
    { value: "1024x1024", label: "1024x1024" },
    { value: "1024x768", label: "1024x768 (Landscape)" },
    { value: "768x1024", label: "768x1024 (Portrait)" },
  ]

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">AI Image Generation</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Transform your ideas into stunning visuals with our AI-powered image generator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the image you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="h-32"
                    />
                  </div>

                  <div>
                    <Label htmlFor="negative-prompt">Negative Prompt (Optional)</Label>
                    <Textarea
                      id="negative-prompt"
                      placeholder="Elements you want to exclude from the image..."
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="h-20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="style">Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger id="style">
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
                      <Label htmlFor="size">Size</Label>
                      <Select value={size} onValueChange={setSize}>
                        <SelectTrigger id="size">
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
                      <Label htmlFor="steps">Generation Steps: {steps}</Label>
                    </div>
                    <Slider
                      id="steps"
                      min={10}
                      max={50}
                      step={1}
                      value={[steps]}
                      onValueChange={(value) => setSteps(value[0])}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Faster</span>
                      <span>Higher Quality</span>
                    </div>
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
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Tips for Better Results</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Be specific about what you want to see in the image</li>
                  <li>• Include details about style, lighting, and composition</li>
                  <li>• Use negative prompts to exclude unwanted elements</li>
                  <li>• Experiment with different styles and settings</li>
                  <li>• Higher step counts generally produce better quality but take longer</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div>
            <Card className="h-full flex flex-col">
              <CardContent className="pt-6 flex-grow flex flex-col">
                <h3 className="text-lg font-medium mb-4">Generated Image</h3>

                {generatedImage ? (
                  <div className="flex-grow flex flex-col">
                    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-grow flex items-center justify-center">
                      <img
                        src={generatedImage || "/placeholder.svg"}
                        alt="Generated image"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" onClick={handleGenerate}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                      </Button>
                      <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
                    <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Your generated image will appear here
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
                      Enter a prompt and click "Generate Image" to get started
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

export default ImageGeneration