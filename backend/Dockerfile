FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    proot \
    wget \
    curl \
    procps \
    htop \
    nano \
    vim \
    tree \
    net-tools \
    iproute2 \
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

# Create a minimal rootfs for sandboxing
RUN mkdir -p /app/rootfs/{bin,lib,lib64,usr,etc,home,tmp,proc,dev} && \
    cp -a /bin/* /app/rootfs/bin/ 2>/dev/null || true && \
    cp -a /usr/bin/* /app/rootfs/bin/ 2>/dev/null || true && \
    cp -a /lib/* /app/rootfs/lib/ 2>/dev/null || true && \
    cp -a /lib64/* /app/rootfs/lib64/ 2>/dev/null || true && \
    cp -a /usr/lib/* /app/rootfs/usr/lib/ 2>/dev/null || true && \
    echo "root:x:0:0:root:/root:/bin/bash" > /app/rootfs/etc/passwd && \
    echo "user:x:1000:1000:user:/home/user:/bin/bash" >> /app/rootfs/etc/passwd && \
    mkdir -p /app/rootfs/home/user && \
    chmod 777 /app/rootfs/tmp

# Expose port
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:7860/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
