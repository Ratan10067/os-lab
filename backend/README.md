---
title: OS Lab Terminal
emoji: 💻
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
license: mit
---

# OS Lab - Web Terminal Backend

This is the backend server for the OS Lab web terminal. It provides:

- WebSocket-based terminal sessions
- Sandboxed Linux environment using proot
- Session management and cleanup
- Resource limits for safety

## Architecture

```
Client (Browser) <--WebSocket--> FastAPI Server <--> proot Sandbox <--> Linux Shell
```

## Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Environment Variables

- `MAX_SESSIONS`: Maximum concurrent sessions (default: 50)
- `SESSION_TIMEOUT`: Session timeout in seconds (default: 1800)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## Security

- No root access in sandboxes
- Read-only system files
- Session timeouts
- Resource limits
