---
title: "Configurable API endpoint in client"
labels: enhancement
---
The frontend currently calls the chat API using a hardcoded `http://localhost:3001` URL. Add a Vite environment variable (e.g. `VITE_API_BASE`) so deployments can easily point the client at another server without editing the source.
