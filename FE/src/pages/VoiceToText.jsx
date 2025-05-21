import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, FileAudio, Copy, RefreshCw, Check, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from "react-hot-toast"
const VoiceToText = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcribedText, setTranscribedText] = useState("")
  const [language, setLanguage] = useState("en_us")
  const [audioFile, setAudioFile] = useState(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

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
    { value: "ja", label: "Japanese" }
  ];

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        await handleTranscription(audioBlob);
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
      toast.success("Recording started!");
    } catch (err) {
      console.error("Error starting recording:", err);
      toast.error("Could not access microphone");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    await handleTranscription(file);
  };

  const handleTranscription = async (audioFile) => {
    setIsTranscribing(true);
    try {
      // Upload audio file
      const uploadUrl = 'https://api.assemblyai.com/v2/upload';
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': import.meta.env.VITE_ASSEMBLYAI_API_KEY
        },
        body: audioFile
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');
      const { upload_url } = await uploadResponse.json();
      toast.success("Audio uploaded successfully!");

      // Request transcription
      const transcribeUrl = 'https://api.assemblyai.com/v2/transcript';
      const transcribeResponse = await fetch(transcribeUrl, {
        method: 'POST',
        headers: {
          'Authorization': import.meta.env.VITE_ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: upload_url,
          language_code: language
        })
      });

      if (!transcribeResponse.ok) throw new Error('Transcription request failed');
      const { id: transcriptId } = await transcribeResponse.json();

      // Poll for results
      while (true) {
        const pollingResponse = await fetch(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          { headers: { 'Authorization': import.meta.env.VITE_ASSEMBLYAI_API_KEY }}
        );

        if (!pollingResponse.ok) throw new Error('Polling failed');
        const result = await pollingResponse.json();

        if (result.status === 'completed') {
          setTranscribedText(result.text);
          toast.success("Transcription complete!");
          break;
        } else if (result.status === 'error') {
          throw new Error(result.error);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error("Transcription error:", err);
      toast.error(err.message || "Failed to transcribe audio");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopyText = () => {
    if (transcribedText) {
      navigator.clipboard.writeText(transcribedText)
      setCopied(true)

      toast.success("Copied to clipboard");

      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Voice to Text Conversion
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Convert speech to text with our accurate AI transcription service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
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

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="mb-2 block">Record Audio</Label>
                      <div className="flex justify-center">
                        <Button
                          onClick={isRecording ? handleStopRecording : handleStartRecording}
                          className={`h-24 w-24 rounded-full ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"}`}
                        >
                          {isRecording ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                        </Button>
                      </div>
                      <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {isRecording ? "Click to stop recording" : "Click to start recording"}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Upload Audio File</Label>
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          className="w-full h-20 border-dashed"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center">
                            <Upload className="h-6 w-6 mb-2" />
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
                      </div>
                      <p className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Supports MP3, WAV, M4A, FLAC (max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Tips for Better Transcription</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Minimize background noise when recording</li>
                  <li>• Use a good quality microphone if possible</li>
                  <li>• Select the correct language for better accuracy</li>
                  <li>• For longer recordings, consider uploading an audio file</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div>
            <Card className="h-full flex flex-col">
              <CardContent className="pt-6 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Transcribed Text</h3>
                  {transcribedText && (
                    <Button variant="ghost" size="sm" onClick={handleCopyText}>
                      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  )}
                </div>

                {isTranscribing ? (
                  <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
                    <RefreshCw className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                    <p className="text-gray-700 dark:text-gray-300 text-center">Transcribing your audio...</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-2">
                      This may take a few moments
                    </p>
                  </div>
                ) : transcribedText ? (
                  <div className="flex-grow flex flex-col">
                    <Textarea
                      value={transcribedText}
                      onChange={(e) => setTranscribedText(e.target.value)}
                      className="flex-grow min-h-[300px] resize-none"
                    />
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Language: {languageOptions.find((l) => l.value === language)?.label}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setTranscribedText("")
                          setAudioFile(null)
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceToText