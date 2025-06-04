import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const LLM_ENDPOINT = process.env.LLM_ENDPOINT || 'http://localhost:1234/v1/chat/completions';
const MOCK_RESPONSE = process.env.MOCK_RESPONSE;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body || {};
    if (MOCK_RESPONSE) {
      res.json({
        id: 'mock',
        choices: [{ message: { role: 'assistant', content: MOCK_RESPONSE } }]
      });
      return;
    }
    
    const response = await fetch(LLM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('LLM request error', err);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
