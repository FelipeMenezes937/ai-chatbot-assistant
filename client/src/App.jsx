import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('llama2')
  const [models, setModels] = useState([])
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchModels()

    socket.on('response', (data) => {
      if (data.done) {
        setIsLoading(false)
      } else if (data.text) {
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last && last.role === 'assistant' && !last.done) {
            return [...prev.slice(0, -1), { ...last, content: last.content + data.text }]
          }
          return prev
        })
      }
    })

    socket.on('error', (data) => {
      setError(data.message)
      setIsLoading(false)
    })

    return () => {
      socket.off('response')
      socket.off('error')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models')
      const data = await res.json()
      if (data.models) {
        setModels(data.models)
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].name)
        }
      }
    } catch (err) {
      setError('Failed to connect to Ollama. Make sure it is running.')
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError('')

    setMessages(prev => [...prev, { role: 'assistant', content: '', done: false }])

    socket.emit('chat', { message: input, model: selectedModel })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#0f3460] p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">AI Chatbot Assistant</h1>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-[#16213e] text-white px-3 py-2 rounded border border-[#e94560] focus:outline-none"
          >
            {models.map(m => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg">Start a conversation with AI</p>
              <p className="text-sm">Make sure Ollama is running on localhost:11434</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="font-bold text-xs mb-1 text-[#e94560]">
                {msg.role === 'user' ? 'You' : 'AI'}
              </div>
              <p className="whitespace-pre-wrap">{msg.content || (isLoading && msg.role === 'assistant' ? 'Thinking...' : '')}</p>
            </div>
          ))}

          {isLoading && (
            <div className="chat-message ai-message">
              <div className="typing-indicator flex gap-1">
                <span className="w-2 h-2 bg-[#e94560] rounded-full"></span>
                <span className="w-2 h-2 bg-[#e94560] rounded-full"></span>
                <span className="w-2 h-2 bg-[#e94560] rounded-full"></span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-[#0f3460] p-4">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#16213e] text-white px-4 py-3 rounded-lg border border-[#e94560] focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#e94560] text-white px-6 py-3 rounded-lg hover:bg-[#c73e54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  )
}

export default App