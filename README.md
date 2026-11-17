# Local AI Assistant

A powerful, privacy-first AI chat application that runs entirely on your machine. No cloud dependencies, no data leaves your device — just you and your AI assistant.

Built for developers who want full control over their AI experience without sacrificing convenience.

## Why Use Assistant?

- **Privacy First** — Your conversations never leave your machine
- **Local & Fast** — No API calls or internet required after setup
- **Open Source** — Full transparency, no vendor lock-in
- **Customizable** — Multiple themes and models to match your workflow

## Features

- Real-time AI chat with streaming responses
- **Auto-detected model support** — discovers all installed Ollama models automatically
- Chat history persistence via `localStorage`
- **4 Themes** — cool white, warm white, dark, and pure black
- Multiple chat threads with a searchable thread index sidebar
- Markdown rendering with code syntax highlighting (GitHub-flavored)
- Streaming cancellation (Ctrl+C or click to cancel)
- Reduced motion support
- Docker Compose setup included
- Ready to deploy on Cloudflare Pages

## Tech Stack

- **Framework** — React 19 + TypeScript
- **Build Tool** — Vite 6 (SWC)
- **Styling** — Tailwind CSS v4
- **AI Engine** — Ollama (local)
- **Storage** — `localStorage`
- **Deployment** — Cloudflare Pages (Wrangler)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [Bun](https://bun.sh) (recommended, or use npm)
- [Ollama](https://ollama.com)

### Installation

Install dependencies:

```bash
bun install
# or
npm install
```

Pull the models you want to use:

```bash
ollama pull qwen2.5:1.5b
ollama pull llama3.2:1b
```

### Running

Start the development server:

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:5137](http://localhost:5137) and start chatting!

### Docker (Optional)

Run everything in Docker:

```bash
docker compose up -d
```

This starts Ollama on port `11434` and the frontend on port `80`.

### Deploy

Deploy to Cloudflare Pages:

```bash
bun run deploy
# or
npm run deploy
```

## Available Models

The UI auto-detects all models installed in your local Ollama instance. Head to the [Ollama Library](https://ollama.com/library) to browse and install more. Popular choices:

- **qwen2.5:1.5b** — Lightweight, excellent for everyday tasks
- **llama3.2:1b** — Fast, general purpose
- **deepseek-r1:1.5b** — Strong reasoning capabilities

---

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Build for production |
| `bun run lint` | Run ESLint |
| `bun run preview` | Build + preview with Wrangler locally |
| `bun run deploy` | Build + deploy to Cloudflare Pages |

---

## Contributing

Contributions welcome! Open an issue or PR to get started.

---

**Built with care for developers, by developers.**
