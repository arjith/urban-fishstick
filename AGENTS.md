# Agent Guidelines

This repository hosts a minimal React (frontend) and Express (backend) project.
To keep contributions consistent, follow these rules when modifying files in this
repo:

1. **Testing and Linting**
   - Run `npm test` from the repository root. The current test script is a
     placeholder but it should still be executed to verify basic commands work.
   - Run `npm --workspace client run lint` to ensure the React frontend passes
     eslint checks.
2. **Coding Style**
   - The server uses ECMAScript modules. Prefer `import`/`export` syntax over
     `require`.
   - Do not commit anything under `node_modules/`.
3. **Pull Request Notes**
   - Summaries should mention any major files updated and describe the change.
   - The testing section of the PR should capture the output of the commands
     listed in step 1.

