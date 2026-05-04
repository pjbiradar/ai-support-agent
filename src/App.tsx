import { useState } from 'react'

function App() {
  const [messages, setMessages] = useState<{role: string; text: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }]
          })
        }
      )

      const data = await response.json()
      const aiText = data.candidates[0].content.parts[0].text

      setMessages(prev => [...prev, { role: 'AI', text: aiText }])
    } catch (error) {
      console.log(error)
      setMessages(prev => [...prev, { role: 'AI', text: 'Something went wrong. Try again.' }])
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>AI Support Agent</h1>

      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.role}:</strong> {msg.text}</p>
        ))}
        {loading && <p>AI is thinking...</p>}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />
      <button onClick={sendMessage} disabled={loading}>Send</button>
    </div>
  )
}

export default App