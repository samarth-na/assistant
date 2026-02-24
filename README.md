---
id: assistant
aliases:
    - chatbot
tags:
    - readme
---

## dependcies

- [ node ](https://nodejs.org/en)
- [ ollama ](https://ollama.com/)

| Model              | Name       | size | parameters |
| ------------------ | ---------- | ---- | ---------- |
| qwen2.5:1.5b       | qwen-1.5b  | 986M | 1.5b       |
| qwen2.5:3b         | qwen-3b    | 1.9G | 3b         |
| qwen2.5-coder:1.5b | qwen-coder | 986M | 1.5b       |
| deepseek-r1:1.5b   | deepseek   | 1.2G | 1.5b       |
| deepscaler:latest  | deepscaler | 3.6G | 1.5b       |
| llama3.2:1b        | llama-1b   | 1.3G | 1b         |
| llama3.2:3b        | llama-3b   | 2.0G | 3b         |

---

## steps

- install node dependcies

```
npm i
```

- install models with ollama

```
ollama install <model>
```

- run the app

```
npm run dev
```

---

## Deployment to Cloudflare Pages via GitHub

### Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- A [GitHub account](https://github.com/signup)
- Your code pushed to a GitHub repository

### Option 1: Direct Deployment via Cloudflare Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ollama-web-ui.git
   git push -u origin main
   ```

2. **Go to Cloudflare Dashboard**
   - Visit [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** > **Create Application**
   - Select **Pages** tab
   - Click **Connect to Git**

3. **Connect your repository**
   - Select your GitHub account and repository
   - Configure build settings:
     - **Production branch**: `main`
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - Click **Save and Deploy**

4. **Configure environment variables (if needed)**
   - In your Cloudflare Pages project, go to **Settings** > **Environment Variables**
   - Add any required variables for your Ollama backend

### Option 2: GitHub Actions Deployment

1. **Get Cloudflare credentials**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Profile** > **API Tokens**
   - Create a new token with **Edit Cloudflare Workers** permissions
   - Copy your **Account ID** from the right sidebar

2. **Add secrets to GitHub**
   - Go to your GitHub repository
   - Navigate to **Settings** > **Secrets and variables** > **Actions**
   - Add these repository secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

3. **Deploy automatically**
   - The GitHub Actions workflow will automatically deploy on every push to `main`
   - View deployment status in **Actions** tab

### Accessing your deployed app

- Your app will be available at `https://<project-name>.pages.dev`
- You can add a custom domain in Cloudflare Dashboard

### Important Notes

> ⚠️ **Ollama Backend**: This UI connects to a local Ollama instance (`http://localhost:11434`). For production deployment:
> - Deploy Ollama on a server with public HTTPS access
> - Update the API endpoint in the code to point to your remote Ollama server
> - Configure CORS on your Ollama server to allow requests from your Cloudflare Pages domain

---

## penging

- [ ] add a real proper readme (will add readme later :p)

## going on

- [ ] adding shadcn library
- [ ] adding drizzle kit
- [ ] add database neon
- [ ] test

## to do

- [ ] add MD rendering with mdx
- [ ] add message stats and ui
- [ ] add chats history sidebar and option to switch
- [ ] add dark mode and option to switch
- [ ] add authentication
- [ ] add options
    - [ ] temperature
    - [ ] system prompt
- [ ] host on ampere A1

## completed

- [x] save chats to local storage
- [x] add chat history
- [x] add options to switch chat models
- [x] create chat interface
- [x] migrated to ollama npm package

---

> these are the tasks for initial design my actual aim is for it be an
> assistant such as google's ,siri and such but an actual usable like setting
> up timers event on calendar reading the messages and such it needs a lot more
> capabilities for that to which I hope I can accomplish I'm making this for
> myself first and foremost not to turn this into an start-up
