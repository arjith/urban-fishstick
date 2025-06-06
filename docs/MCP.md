# MCP Detection and Connection

This guide explains how Urban Fishstick can discover and connect to MCP (Multi-Connection Point) devices. The server scans the local network and exposes API routes for clients to initiate connections.

## Discovery
1. Run `GET /api/mcps/discover` to receive a list of detected MCP addresses.
2. If no devices appear, specify addresses manually via the `MCP_HOSTS` environment variable.

## Connection
1. POST to `/api/mcps/connect` with a JSON body containing an `address` field.
2. The server establishes a persistent connection and returns a confirmation message.

See `FEATURES.md` for the planned implementation details.
