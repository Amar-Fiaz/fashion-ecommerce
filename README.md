# Fashion E-Commerce Platform

Production-quality fashion e-commerce platform built on the MERN stack.

See `CLAUDE.md` for project rules and `docs/` for full architecture, phase plan, and progress tracking.

## Project Structure

- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend
- `docs/` — Project documentation

## Running Locally (Phase 1 foundation)

Client and server run independently, in separate terminals.

### Server

\`\`\`
cd server
cp .env.example .env   # then fill in real values
npm install
npm run dev
\`\`\`

### Client

\`\`\`
cd client
cp .env.example .env   # then fill in real values
npm install
npm run dev
\`\`\`