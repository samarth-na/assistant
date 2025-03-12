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

