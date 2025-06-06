# Planned Features for Urban Fishstick

This document outlines potential enhancements for the project along with the individual tasks required to implement them. Each task describes suggested steps, how to test, and contingency advice in case of issues. These notes help future contributors build and maintain new capabilities smoothly.

## 1. Streaming LLM Responses
Allow the chat interface to display assistant replies incrementally rather than waiting for the full response.

### Tasks

**1.1 Update the server to proxy streaming requests**
- **Implementation steps**
  1. Add a POST `/api/chat/stream` route in `server/index.js`. Build the request body from the incoming payload and set `stream: true` before forwarding it to the LLM.
  2. Pipe the LLM `fetch` response body back to the client with `res.write` and set `Content-Type: text/event-stream`. Call `res.end()` when streaming completes.
  3. Keep the existing `/api/chat` route unchanged so clients that do not request streaming still receive the full JSON response.
- **Testing instructions**
  - Run `npm --workspace server test` once server tests are expanded to cover streaming.
  - Manually send a POST request with `stream: true` using `curl` and confirm chunks arrive progressively.
- **Contingency guidance**
  - If Node.js errors about readable streams occur, research examples of proxying streaming fetch responses with Express (`node-fetch` docs often include patterns).
  - Consider polyfills or upgrading dependencies if streaming is not supported.

**1.2 Update the React client for streaming**
- **Implementation steps**
  1. Add a new hook that opens a `ReadableStream` from the server and appends text to the last assistant message as chunks arrive.
  2. Provide a toggle in the UI to enable or disable streaming mode.
  3. Fallback to the existing non‑streaming request for browsers that lack streaming support.
- **Testing instructions**
  - Run `npm --workspace client run lint`.
  - Manually verify partial text appears in the chat while the response is being generated.
- **Contingency guidance**
  - If you encounter CORS or network errors, confirm the server route uses the same origin or correct CORS headers.
  - Search for examples of using `fetch` with `ReadableStream` in React if the implementation stalls.

## 2. Persist Conversation History
Save past chat sessions so they can be reloaded when the page reloads.

### Tasks

**2.1 Implement a history API on the server**
- **Implementation steps**
  1. Create `server/history.js` with helper functions `saveHistory(messages, id)` and `loadHistory(id)` that use `fs/promises`.
  2. Add POST `/api/history/save` and GET `/api/history/load` routes in `server/index.js` that call these helpers.
  3. Store conversation files under `server/data/`. Generate a unique ID with `crypto.randomUUID()` when saving and return it to the client.
- **Testing instructions**
  - Write tests in `server/test/history.test.js` exercising both routes with a short conversation.
  - Confirm the file appears in the `data` directory and the contents match the request payload.
- **Contingency guidance**
  - If file permissions cause errors, ensure the `data` directory exists and Node has write access.
  - Research using `fs.mkdir` with `{ recursive: true }` to create the folder if it is missing.

**2.2 Connect the React UI to history endpoints**
- **Implementation steps**
  1. When the user clicks a "Save" button, POST the current messages array to `/api/history/save` and store the returned ID in React state or local storage.
  2. Provide an input box for an ID and load the conversation from `/api/history/load?id=...`.
  3. Display a drop-down listing saved IDs from local storage for convenience.
- **Testing instructions**
  - Run `npm --workspace client run lint`.
  - Manually test saving, reloading the page, and loading the conversation to verify messages reappear.
- **Contingency guidance**
  - If JSON parsing fails, log the server response for debugging. Use the browser network tab to check requests.
  - Research how to manage React state when asynchronously loading data if the chat UI behaves unexpectedly.

## 3. Expose Agent Utility Functions
Allow clients to trigger helper functions like `browse` or `readFile` through the API.

### Tasks

**3.1 Create an `/api/agent` route**
- **Implementation steps**
  1. Add a POST `/api/agent` route in `server/index.js` that parses `{ name, args }` from the request body.
  2. Map `name` to the matching function exported from `server/agents.js` and `await` its result with the provided `args`.
  3. Return `{ result }` on success or `{ error }` on failure.
- **Testing instructions**
  - Write tests in `server/test/agent.test.js` that mock calls to these functions and assert the JSON response.
- **Contingency guidance**
  - Validate incoming args on the server to avoid crashes from unexpected input.
  - If dynamic `import` paths cause issues, check the current module system (ESM) and adjust imports accordingly.


**3.2 Provide a simple client interface**
- **Implementation steps**
  1. In the React UI, add controls for selecting an agent and entering its parameters.
  2. Send a POST request to `/api/agent` and show the returned result in the chat window or a separate panel.
  3. Document available agents in the UI so users know what is supported.
- **Testing instructions**
  - Run `npm --workspace client run lint`.
  - Manually test each agent with valid and invalid inputs, confirming errors are displayed.
- **Contingency guidance**
  - If the server returns unexpected results, log request/response payloads to debug.
  - Check browser console for CORS errors or network failures.

---
## 4. Detect and Latch onto MCPs
Make it easy for the server and client to discover MCP devices and connect to them.

### Tasks

**4.1 Discover available MCPs**
- **Implementation steps**
  1. Create `server/mcp.js` with a `discoverMcps` function that scans the local network or configured ports for MCP devices.
  2. Add a GET `/api/mcps/discover` route in `server/index.js` that returns the list from `discoverMcps`.
- **Testing instructions**
  - Write tests in `server/test/mcp.test.js` that mock the scanning logic and verify the API output.
  - Run `curl /api/mcps/discover` and confirm addresses are returned.
- **Contingency guidance**
  - If discovery fails, allow manual addresses via an `MCP_HOSTS` environment variable.
  - Research Node UDP broadcast examples if network scanning does not work.

**4.2 Connect to a selected MCP**
- **Implementation steps**
  1. Add a `connectToMcp(address)` function in `server/mcp.js` that establishes a WebSocket or HTTP connection.
  2. Create a POST `/api/mcps/connect` route that calls this function and stores the active connection.
  3. Provide helpful error messages when connection attempts fail.
- **Testing instructions**
  - Mock an MCP endpoint during tests and assert that connection data is stored.
  - Use `curl -X POST /api/mcps/connect -H 'Content-Type: application/json' -d '{"address":"http://localhost:4000"}'`.
- **Contingency guidance**
  - Check firewall settings if the request times out.
  - Log connection errors to the server console for debugging.

**4.3 Add client controls for MCPs**
- **Implementation steps**
  1. Add a "Scan for MCPs" button in the UI that calls `/api/mcps/discover`.
  2. Show discovered MCPs in a list and allow connecting to one.
  3. Provide a manual address field if no MCPs are found automatically.
- **Testing instructions**
  - Run `npm --workspace client run lint`.
  - Manually test scanning and connecting through the UI.
- **Contingency guidance**
  - Check browser network logs if connections fail.
  - Keep the manual entry fallback available.

**4.4 Document the MCP feature**
- **Implementation steps**
  1. Create `docs/MCP.md` describing MCP detection and setup steps.
  2. Mention environment variables like `MCP_HOSTS` in `README.md`.
- **Testing instructions**
  - Ensure project tests and lint pass after adding docs.
- **Contingency guidance**
  - Update documentation whenever the API changes.

These feature plans serve as a roadmap for gradually enhancing Urban Fishstick. As new tasks are implemented, remember to run `npm test` from the repository root and `npm --workspace client run lint` before committing changes.
