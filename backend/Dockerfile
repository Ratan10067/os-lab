FROM python:3.11-slim

# Install comprehensive OS learning tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Core utilities
    procps \
    coreutils \
    # Version Control
    git \
    # Compilers & Development
    gcc \
    g++ \
    make \
    gdb \
    # Editors
    nano \
    vim \
    # System monitoring
    htop \
    strace \
    # File & Disk utilities
    tree \
    file \
    # Network tools
    net-tools \
    iproute2 \
    curl \
    wget \
    # Process & Memory tools
    psmisc \
    # Shell utilities
    bash \
    # Compression
    gzip \
    zip \
    unzip \
    # Text processing
    less \
    grep \
    sed \
    # Other useful tools
    man-db \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create app directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for user sessions and sample files
RUN mkdir -p /app/sessions /home/user && \
    echo '#include <stdio.h>\nint main() { printf("Hello, OS Lab!\\n"); return 0; }' > /home/user/hello.c && \
    echo '#include <unistd.h>\n#include <stdio.h>\nint main() { pid_t pid = fork(); if (pid == 0) printf("Child: %d\\n", getpid()); else printf("Parent: %d, Child: %d\\n", getpid(), pid); return 0; }' > /home/user/fork_demo.c && \
    chmod 777 /home/user

# Set environment
ENV HOME=/home/user
ENV TERM=xterm-256color

# Expose port (Hugging Face uses 7860)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7860/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
