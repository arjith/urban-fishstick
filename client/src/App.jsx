import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], stream: false })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message || { role: 'assistant', content: 'No response' };
      setMessages((msgs) => [...msgs, reply]);
    } catch (err) {
      console.error(err);
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error from server' }]);
    }
  };

  return (
    <div className="App">
      <h1>Urban Fishstick Agent</h1>
      <div className="messages">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role}>{m.role}: {m.content}</div>
        ))}
      </div>
      <div className="input">
        <textarea value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
