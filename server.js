require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const MODEL_NAME = process.env.MODEL_NAME || 'codellama:latest';

app.get('/api/models', async (req, res) => {
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/tags`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message, model } = req.body;
    
    try {
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model || MODEL_NAME,
                prompt: message,
                stream: false
            })
        });
        
        const data = await response.json();
        res.json({ response: data.response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');
    
    socket.on('chat', async (data) => {
        try {
            const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: data.model || MODEL_NAME,
                    prompt: data.message,
                    stream: true
                })
            });
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    try {
                        const parsed = JSON.parse(line);
                        socket.emit('response', { text: parsed.response, done: parsed.done });
                    } catch (e) {}
                }
            }
            
            socket.emit('response', { done: true });
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Ollama host: ${OLLAMA_HOST}`);
    console.log(`Default model: ${MODEL_NAME}`);
});