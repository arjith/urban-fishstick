# Urban Fishstick Server

This Express server proxies requests to a local LLM endpoint such as LM Studio, oobabooga, or Ollama. Set the `LLM_ENDPOINT` environment variable to your running model's HTTP endpoint. By default it uses `http://localhost:1234/v1/chat/completions`.
Set `MOCK_RESPONSE` to return a fixed reply instead of calling an LLM.

```bash
cd server
npm install
npm start
```
