# Ollama Web UI - Context Documentation

## Project Overview

A React-based web interface for interacting with Ollama LLM models locally. Built with Vite, React 19, TypeScript, and Tailwind CSS 4.

---

## Architecture

### Tech Stack
- **Framework**: React 19 (with TypeScript)
- **Build Tool**: Vite 6 with SWC plugin
- **Styling**: Tailwind CSS 4 with PostCSS
- **State Management**: React hooks (useState, useReducer, useRef)
- **HTTP Client**: Ollama npm package (v0.5.13)
- **Package Manager**: Yarn 1.22.22

### Project Structure
```
/home/samarth/codes/languages/js/react/assistant/
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.jsx                  # Main application component (active)
│   ├── Apptest.jsx              # Alternative/test implementation
│   ├── index.css                # Tailwind styles and base styles
│   ├── vite-env.d.ts            # Vite type declarations
│   └── components/
│       ├── sidebar.jsx          # Collapsible sidebar component
│       ├── MessageInput.jsx     # Message input form component
│       ├── MessageOutput.jsx    # Chat display component
│       └── model.jsx            # Model selector component
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript project references
├── tsconfig.app.json            # TypeScript app config
├── eslint.config.js             # ESLint configuration
└── README.md                    # Project documentation
```

---

## Core Components

### 1. App.jsx (Main Component)
**Location**: `src/App.jsx:1-190`

The primary application component that orchestrates the chat functionality.

**Key Features**:
- **Message State Management**: Uses `useReducer` for efficient message updates
- **Streaming Responses**: Real-time streaming from Ollama API
- **Cancellable Streams**: Ctrl+C or click to cancel ongoing generation
- **Auto-scroll**: Automatically scrolls to latest message
- **Chat Persistence**: Saves completed chats to localStorage

**State Variables**:
- `prompt`: Current input text
- `isLoading`: Loading/generating state
- `chat`: Selected model (default: "qwen2.5:1.5b")
- `messages`: Array of conversation messages via reducer
- `abortControllerRef`: For cancelling fetch requests

**Key Functions**:
- `handleSubmit()`: Sends message to Ollama and handles streaming
- `handleCancelStream()`: Aborts ongoing generation
- `saveChatToLocalStorage()`: Persists chat history

**Reducer Pattern** (`src/App.jsx:14-25`):
```javascript
const messagesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGE": return [...state, action.payload];
    case "UPDATE_LAST_MESSAGE": 
      return state.map((msg, index) =>
        index === state.length - 1 ? { ...msg, content: action.payload } : msg
      );
  }
};
```

### 2. ChatSelector (Model Selector)
**Location**: `src/components/model.jsx:1-37`

Button group for selecting LLM models.

**Available Models**:
| Model | Display Name |
|-------|-------------|
| llama3.2:1b | llama1B |
| llama3.2:3b | llama3B |
| qwen2.5:1.5b | qwen1B |
| qwen2.5:3b | qwen3B |
| qwen2.5-coder:1.5b | qwen-coder |
| erwan2/DeepSeek-R1-Distill-Qwen-1.5B:latest | qwen1.5B distilled |
| deepscaler:latest | deepscaler |
| deepseek-r1:1.5b | deepseek |

**Props**:
- `chat`: Currently selected model string
- `setChat`: Function to update selected model

### 3. MessageOutput (Chat Display)
**Location**: `src/components/MessageOutput.jsx:1-53`

Displays the conversation history with auto-scrolling.

**Features**:
- Auto-scrolls to bottom when messages update
- Different styling for user vs assistant messages
- User messages: right-aligned with blue background
- Assistant messages: left-aligned with gray text

**Props**:
- `messages`: Array of message objects `{role, content}`
- `chat`: Current model (passed to ChatSelector)
- `setChat`: Model setter function

### 4. MessageInput (Input Form)
**Location**: `src/components/MessageInput.jsx:1-50`

Textarea input with form submission handling.

**Features**:
- Multi-line textarea with auto-resize capability
- Submit on Enter key (configurable for Shift+Enter)
- Cancel button during streaming
- Keyboard shortcut hints

**Props**:
- `onSubmit(prompt)`: Callback when form submitted
- `isLoading`: Boolean for loading state
- `handleCancelStream()`: Callback to cancel generation

### 5. Sidebar
**Location**: `src/components/sidebar.jsx:1-82`

Collapsible navigation sidebar (currently basic template).

**Features**:
- Slide-in/out animation with Tailwind transitions
- Toggle button in main content area
- Close button inside sidebar
- Placeholder navigation links

---

## Data Flow

### Message Flow
1. User types in MessageInput textarea
2. On submit (Enter or click), `handleSubmit` is called
3. User message added to state via `ADD_MESSAGE`
4. Empty assistant message added as placeholder
5. Ollama.chat() called with conversation history
6. Stream chunks appended via `UPDATE_LAST_MESSAGE`
7. On completion, chat saved to localStorage
8. UI auto-scrolls to show new messages

### Chat Persistence
```javascript
// Storage format
{
  id: "2026-02-09T10:30:00.000Z",
  heading: "First user message",
  messages: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ]
}
```

---

## Ollama Integration

### API Usage
```javascript
import ollama from "ollama";

const response = await ollama.chat({
  model: chat,           // e.g., "qwen2.5:1.5b"
  messages: conversationToSend,  // Full conversation history
  stream: true,          // Enable streaming
  signal: abortControllerRef.current.signal,  // For cancellation
});

for await (const part of response) {
  assistantMessage += part.message?.content || "";
  // Update UI with each chunk
}
```

### Requirements
- Ollama must be running locally on default port (11434)
- Selected model must be installed via `ollama pull <model>`

---

## Configuration Files

### Vite Config (`vite.config.ts`)
```typescript
export default defineConfig({
    server: {
        host: "0.0.0.0",  // Allow external connections
    },
    plugins: [react(), tailwindcss()],
});
```

### TypeScript Config (`tsconfig.app.json`)
- Target: ES2020
- Module: ESNext with bundler resolution
- JSX: react-jsx transform
- Strict mode enabled with unused locals/parameters checks

### ESLint Config (`eslint.config.js`)
- TypeScript ESLint recommended rules
- React Hooks rules
- React Refresh plugin for HMR

---

## Dependencies

### Production
- `react` & `react-dom`: v19.0.0
- `ollama`: v0.5.13 (Ollama JavaScript client)
- `axios`: v1.7.9 (HTTP client - currently unused)
- `@tailwindcss/vite`: v4.0.5 (Tailwind Vite plugin)

### Development
- `vite`: v6.1.0
- `@vitejs/plugin-react-swc`: v3.5.0 (SWC-based React plugin)
- `typescript`: ~5.7.2
- `tailwindcss`: v4.0.5
- `eslint`: v9.19.0 with React plugins

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## Styling

### Tailwind CSS 4
- Uses new `@import "tailwindcss"` syntax
- No separate tailwind.config.js (config in CSS)
- Custom base layer for form elements

### Color Scheme
- Background: `bg-gray-100/50` (light gray with transparency)
- User messages: `bg-blue-100/50` (light blue)
- Input area: `bg-gray-50`
- Borders: `border-gray-200`

### Layout
- Main chat: `w-[50%]` with `min-w-[700px]`
- Fixed input area at bottom with transform centering
- Flex column layout with `flex-1` for chat area

---

## Development Notes

### Current Implementation
- App.jsx contains inline MessageOutput and MessageInput (not using component files)
- Component files (MessageInput.jsx, MessageOutput.jsx) exist but are not imported
- Apptest.jsx contains older implementation using direct fetch API
- Sidebar component exists but is not integrated into App.jsx

### Keyboard Shortcuts
- **Enter**: Submit message
- **Ctrl+C**: Cancel ongoing stream generation

### Known Issues/TODO
- Components are defined but not modularized in App.jsx
- Sidebar is not connected to main app
- No dark mode implementation yet
- No chat history sidebar for switching conversations
- No markdown rendering for responses

---

## Model Requirements

Models must be installed locally via Ollama CLI:

```bash
ollama pull qwen2.5:1.5b
ollama pull llama3.2:1b
ollama pull deepseek-r1:1.5b
# etc.
```

Full list of supported models in README.md.

---

## File Relationships

```
main.tsx
    └── App.jsx (main entry)
        ├── model.jsx (ChatSelector for model switching)
        └── (inline MessageOutput + MessageInput)
    
Component files (not currently used by App.jsx):
    ├── MessageInput.jsx
    ├── MessageOutput.jsx
    └── sidebar.jsx

Alternative implementation:
    └── Apptest.jsx (older version with fetch API)
```

---

## Future Plans (from README)

### In Progress
- Adding shadcn/ui library
- Adding Drizzle ORM
- Neon database integration
- Testing

### TODO
- MDX rendering for messages
- Message statistics UI
- Chat history sidebar with switch capability
- Dark mode toggle
- Authentication system
- Temperature and system prompt options
- Hosting on Ampere A1

### Completed
- LocalStorage chat persistence
- Chat history display
- Model switching
- Chat interface creation
- Migration to Ollama npm package

---

## Environment

- **Platform**: Linux
- **Working Directory**: `/home/samarth/codes/languages/js/react/assistant`
- **Package Manager**: Yarn 1.22.22
- **Node**: ES Modules ("type": "module")

---

*Generated on: Mon Feb 09 2026*
