# 🖥️ Web-Based OS Lab

A web-based terminal platform for practicing operating system concepts in a sandboxed Linux environment.

![Terminal Preview](https://via.placeholder.com/800x400/0a0a0f/22c55e?text=OS+Lab+Terminal)

## 🚀 Features

- **Real Linux Shell** - Access a fully functional terminal in your browser
- **Sandboxed Environment** - Each session is isolated and secure
- **Guided Labs** - Step-by-step experiments for OS concepts
- **No Installation** - Works on any OS with a modern browser

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       VERCEL (Frontend)                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React + Vite + Xterm.js                │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                HUGGING FACE SPACES (Backend)                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   FastAPI Server                    │    │
│  │  ┌───────────────────────────────────────────────┐  │    │
│  │  │            Session Manager                    │  │    │
│  │  │  ┌─────────────────────────────────────────┐  │  │    │
│  │  │  │         proot Sandbox                   │  │  │    │
│  │  │  │      (Isolated Linux Shell)             │  │  │    │
│  │  │  └─────────────────────────────────────────┘  │  │    │
│  │  └───────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
LinuxServer/
├── frontend/                 # React app (Vercel)
│   ├── src/
│   │   ├── components/       # Terminal, Navbar, Sidebar
│   │   ├── pages/           # Home, Lab, Login
│   │   └── hooks/           # useWebSocket
│   ├── package.json
│   └── vercel.json
│
└── backend/                  # Python server (Hugging Face)
    ├── app/
    │   ├── main.py          # FastAPI app
    │   ├── websocket.py     # WebSocket handler
    │   ├── sandbox.py       # proot sandbox
    │   ├── sessions.py      # Session management
    │   └── labs/            # Lab experiments
    ├── Dockerfile
    └── requirements.txt
```

## 🛠️ Local Development

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --port 8000
```

## 🚀 Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Set the following:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_BACKEND_URL` = your Hugging Face Space WebSocket URL

### Backend → Hugging Face Spaces

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Create a new Space with **Docker** SDK
3. Upload the `backend/` folder contents to the Space
4. The Space will automatically build and deploy

**Your Space URL will be:**

```
wss://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space/ws
```

## 🔧 Environment Variables

### Frontend

| Variable           | Description           | Default                  |
| ------------------ | --------------------- | ------------------------ |
| `VITE_BACKEND_URL` | Backend WebSocket URL | `ws://localhost:8000/ws` |

### Backend

| Variable          | Description                    | Default |
| ----------------- | ------------------------------ | ------- |
| `MAX_SESSIONS`    | Max concurrent sessions        | `50`    |
| `SESSION_TIMEOUT` | Session timeout (seconds)      | `1800`  |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `*`     |

## 🧪 OS Lab Experiments

| Lab                | Description                            |
| ------------------ | -------------------------------------- |
| Shell Basics       | Learn Linux shell fundamentals         |
| Process Management | Understanding processes, fork, signals |
| File System        | Permissions, inodes, disk usage        |
| CPU Scheduling     | Nice values, process priority          |
| Memory Management  | Virtual memory, memory mapping         |
| IPC & Signals      | Inter-process communication            |

## 🔒 Security

- **proot sandboxing** - User-space isolation
- **No actual root** - Faked root via proot
- **Session timeouts** - Auto-cleanup of inactive sessions
- **Resource limits** - Prevent abuse
- **Read-only system** - Only home directory is writable

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
