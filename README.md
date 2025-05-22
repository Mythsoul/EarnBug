# EarnBug - AI-Powered Creative Suite

EarnBug is a comprehensive AI-powered creative platform that offers various tools for content generation and manipulation. With a modern tech stack and user-friendly interface, it provides a seamless experience for users to leverage AI capabilities.

## 🌟 Features

### 🎨 AI Image Generation
- Generate custom images using text prompts
- Multiple style presets including photographic, digital art, anime, etc.
- Adjustable image parameters (size, quality, steps)
- Download generated images in WebP format

### 🗣️ Text to Voice
- Convert text to natural-sounding speech
- Multiple voice options and languages
- Adjustable speech parameters (speed, pitch)
- Download audio in multiple formats

### 🎤 Voice to Text
- Accurate speech-to-text transcription
- Real-time voice recording
- Support for multiple languages
- Upload audio file option

### 🤖 AI Chatbot
- Intelligent conversation assistant
- Context-aware responses
- Persistent chat history
- Multiple conversation topics

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Zustand for state management
- Axios for API requests

### Backend
- Node.js with Express
- PostgreSQL database
- Passport.js for OAuth authentication (GitHub, Google)
- JWT & Express Session for Authentication / Authorization
- Nodemailer for email services

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Mythsoul/EarnBug.git
cd EarnBug
```

2. Install backend dependencies
```bash
cd be
npm install 
cp .env.sample .env
```

3. Install frontend dependencies
```bash
cd ../FE
npm install
cp .env.sample .env
```

4. Configure environment variables
- Set up your database URL
- Configure OAuth credentials (GitHub, Google)
- Set up email service credentials
- Add API keys for third-party services

5. Start the development servers

Backend:
```bash
cd be
npm run dev
```

Frontend:
```bash
cd FE
npm run dev
```

## 🔐 Authentication

The platform supports multiple authentication methods:
- Email/Password with verification
- GitHub OAuth
- Google OAuth

## 🎨 Theme Support

EarnBug includes a built-in theme system with:
- Light and dark mode
- Persistent theme preferences
- System theme detection

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ✨ Acknowledgments

- [Stability AI](https://stability.ai/) for image generation
- [OpenRouter](https://openrouter.ai/) for AI chat capabilities
- All other third-party services and libraries used in this project
