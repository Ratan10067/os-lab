# 🐧 OS Lab (Operating Systems Laboratory)

> A modern, web-based environment for learning and practicing Operating System concepts directly in your browser.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.0-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

## 📖 Overview

**OS Lab** is an interactive platform built to bridge the gap between theoretical OS concepts and practical implementation. It provides users with a fully functional, web-based terminal environment where they can execute Linux commands, compile C programs, and visualize OS algorithms (like scheduling and process management) without needing a local Linux setup.

Whether you are a student learning about `fork()`, file systems, or memory management, or an instructor looking for a cloud-ready teaching tool, OS Lab provides a safe, sandboxed environment for experimentation.

## 🏗️ Architecture

The application follows a modern client-server architecture with real-time bidirectional communication.

```mermaid
graph TD
    Client[User / Browser] -- HTTP/HTTPS --> Frontend[Frontend (React + Vite)]
    Client -- WebSocket (WSS) --> Backend[Backend (FastAPI)]

    subgraph "Frontend Layer"
        Frontend --> |xterm.js| Terminal[Terminal UI]
        Frontend --> |State| ReactStore[React State]
    end

    subgraph "Backend Infrastructure"
        Backend --> |Auth & Data| DB[(MongoDB)]
        Backend --> |Manage| SessionMgr[Session Manager]

        subgraph "Sandboxed Execution"
            SessionMgr --> |Spawn| PTY[Pseudo-Terminal (PTY)]
            PTY --> |Run| Shell[Shell / OS Commands]
            Shell --> |IO Stream| PTY
        end
    end

    PTY -- Stream Output --> Backend
    Backend -- WebSocket Event --> Frontend
```

## ✨ Features

- **🖥️ Web-Based Terminal**: powered by `xterm.js`, offering a real terminal experience over WebSockets.
- **🛡️ Sandboxed Environments**: Each user gets an isolated session (using `pty` and `proot` where available) to safely run commands.
- **🔐 User Authentication**: Secure signup and login system using JWT and MongoDB.
- **📂 Persistent File System**: Users have their own home directories to create, edit, and save files.
- **⚡ Real-time Interaction**: Low-latency communication between the browser and the backend shell.
- **🐳 Docker Ready**: Easily deployable with Docker and compatible with cloud platforms like Hugging Face Spaces.
- **🛠️ OS Algorithms**: Built-in modules to demonstrate and practice:
  - Process Creation & Management (`fork`, `exec`)
  - CPU Scheduling Algorithms
  - File System Operations

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Terminal**: xterm.js
- **Routing**: React Router DOM

### Backend

- **Framework**: FastAPI (Python 3.11)
- **Real-time**: WebSockets
- **Database**: MongoDB (via Motor async driver)
- **Security**: JWT Authentication, Bcrypt hashing
- **System**: `pty` (pseudo-terminal utilities), `asyncio`

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.11+)
- **MongoDB** (Local or Atlas URI)

### 1. Clone the Repository

```bash
git clone https://github.com/Ratan10067/os-lab.git
cd os-lab
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Configuration**:
Create a `.env` file in the `backend` directory:

```env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=oslab
JWT_SECRET=your_super_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ALLOWED_ORIGINS=http://localhost:5173
```

**Run the Backend**:

```bash
uvicorn app.main:app --reload
```

The API will start at `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory.

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🐳 Docker Deployment

You can containerize the entire backend application using Docker.

```bash
cd backend
docker build -t os-lab-backend .
docker run -p 7860:7860 -e MONGODB_URL="your_mongodb_uri" os-lab-backend
```

> **Note for Hugging Face Spaces**: The Dockerfile is optimized for Hugging Face Spaces, running as a non-root user (UID 1000) on port 7860.

## 🤝 Collaboration & Contributing

**We are actively seeking collaborators!** 🚀

Whether you are a student, an OS enthusiast, or an experienced developer, your contributions are welcome. This project is a great place to learn about system programming, web sockets, and full-stack development.

**How to contribute:**

1. 🍴 **Fork** the repository to your own GitHub account.
2. 👯 **Clone** the project to your local machine.
3. 🎋 Create a **Feature Branch** (`git checkout -b feature/AmazingIdea`).
4. 📝 **Commit** your changes (`git commit -m 'Add some AmazingIdea'`).
5. 🚀 **Push** to the branch (`git push origin feature/AmazingIdea`).
6. 📬 Open a **Pull Request** and we will review it!

If you find a bug or have a suggestion, please open an Issue.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
