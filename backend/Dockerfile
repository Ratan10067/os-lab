FROM python:3.11-slim

# Install comprehensive OS learning tools
RUN apt-get update && apt-get install -y \
    # Core utilities
    proot \
    procps \
    coreutils \
    util-linux \
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
    ltrace \
    # File & Disk utilities
    tree \
    file \
    findutils \
    # Network tools
    net-tools \
    iproute2 \
    curl \
    wget \
    # Process & Memory tools
    psmisc \
    # Shell utilities
    bash \
    zsh \
    # Compression
    gzip \
    bzip2 \
    zip \
    unzip \
    # Text processing
    grep \
    sed \
    awk \
    less \
    # Other useful tools
    man-db \
    time \
    bc \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directory for user sessions
RUN mkdir -p /app/sessions

# Create a minimal rootfs for sandboxing with all tools
RUN mkdir -p /app/rootfs/{bin,lib,lib64,usr,etc,home,tmp,proc,dev,sbin} && \
    # Copy binaries
    cp -a /bin/* /app/rootfs/bin/ 2>/dev/null || true && \
    cp -a /usr/bin/* /app/rootfs/bin/ 2>/dev/null || true && \
    cp -a /sbin/* /app/rootfs/sbin/ 2>/dev/null || true && \
    cp -a /usr/sbin/* /app/rootfs/sbin/ 2>/dev/null || true && \
    # Copy libraries
    cp -a /lib/* /app/rootfs/lib/ 2>/dev/null || true && \
    cp -a /lib64/* /app/rootfs/lib64/ 2>/dev/null || true && \
    cp -a /usr/lib/* /app/rootfs/usr/lib/ 2>/dev/null || true && \
    # Copy includes for gcc
    cp -a /usr/include /app/rootfs/usr/ 2>/dev/null || true && \
    # Setup users
    echo "root:x:0:0:root:/root:/bin/bash" > /app/rootfs/etc/passwd && \
    echo "user:x:1000:1000:user:/home/user:/bin/bash" >> /app/rootfs/etc/passwd && \
    mkdir -p /app/rootfs/home/user && \
    chmod 777 /app/rootfs/tmp && \
    # Create sample C files for learning
    echo '#include <stdio.h>\nint main() {\n    printf("Hello, OS Lab!\\n");\n    return 0;\n}' > /app/rootfs/home/user/hello.c && \
    echo '#include <unistd.h>\n#include <stdio.h>\nint main() {\n    pid_t pid = fork();\n    if (pid == 0) printf("Child: %d\\n", getpid());\n    else printf("Parent: %d, Child: %d\\n", getpid(), pid);\n    return 0;\n}' > /app/rootfs/home/user/fork_demo.c

# Expose port (Hugging Face uses 7860)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7860/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
