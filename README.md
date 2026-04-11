# AI Chatbot Assistant

Real-time AI chatbot using Ollama and Node.js with React + Tailwind frontend.

## About

This project is a chatbot interface that connects to local Ollama models. It provides a modern UI built with React and Tailwind CSS, with real-time communication via WebSockets (Socket.io).

## Features

- Real-time chat with AI models via Ollama
- Model selection dropdown (supports any Ollama model)
- WebSocket communication for streaming responses
- Modern dark UI with Tailwind CSS
- REST API for model listing

## Prerequisites

- Node.js 18+
- Ollama installed and running on localhost:11434

## Installation

```bash
# Clone the repository
cd ai-chatbot-assistant

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

## Configuration

Create a `.env` file in the project root:

```env
PORT=3000
OLLAMA_HOST=http://localhost:11434
MODEL_NAME=codellama:latest
```

## Running

1. Start Ollama (if not running):
```bash
ollama serve
```

2. Start the application:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/models | List available Ollama models |
| POST | /api/chat | Send a message to the chatbot |

## Tech Stack

### Backend
- Node.js
- Express
- Socket.io

### Frontend
- React 18
- Vite
- Tailwind CSS 4
- Socket.io Client

## Project Structure

```
ai-chatbot-assistant/
├── server.js           # Backend server
├── package.json        # Backend dependencies
├── .env               # Environment variables
├── README.md
└── client/
    ├── src/
    │   ├── App.jsx    # Main React component
    │   ├── main.jsx   # React entry point
    │   └── index.css  # Tailwind styles
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

## Notes

- Response speed depends on your hardware and model size
- Make sure Ollama is running before starting the app
- Any Ollama model can be used (llama2, codellama, mistral, etc.)

## License

MIT