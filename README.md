# Urban Fishstick

This project is a minimal React + Express setup to experiment with local LLM agents. The frontend lives in `client/` and the backend proxy server in `server/`.

## Getting Started

Install dependencies for both frontend and backend and start the development servers:

```bash
# start backend
cd server
npm install
npm start
```

In another terminal:

```bash
# start frontend
cd client
npm install
npm run dev
```

Set the `LLM_ENDPOINT` environment variable to the HTTP endpoint of your locally hosted LLM (LM Studio, oobabooga, Ollama, etc.).
For testing without a model, set `MOCK_RESPONSE` when starting the server to return a fixed reply.
Additional agents like `browse`, `readFile`, and `writeFile` are available in `server/agents.js`.
