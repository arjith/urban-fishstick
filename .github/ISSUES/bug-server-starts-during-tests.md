---
title: "Server starts during tests"
labels: bug
---
The Express server automatically calls `app.listen` even during test runs. This leaves open handles and makes automated testing difficult. Move the listener behind a `NODE_ENV !== 'test'` check and export the Express `app` for use in tests.
