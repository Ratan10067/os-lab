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

# Install proot for sandboxing (allows chroot without root privileges)
RUN apt-get update && apt-get install -y --no-install-recommends proot \
    && rm -rf /var/lib/apt/lists/*

# Create rootfs for proot sandboxing (minimal filesystem)
RUN mkdir -p /app/rootfs && \
    # Copy essential directories to rootfs
    cp -a /bin /app/rootfs/ && \
    cp -a /lib /app/rootfs/ && \
    cp -a /lib64 /app/rootfs/ 2>/dev/null || true && \
    cp -a /usr /app/rootfs/ && \
    mkdir -p /app/rootfs/etc /app/rootfs/dev /app/rootfs/proc /app/rootfs/tmp /app/rootfs/home && \
    chmod 1777 /app/rootfs/tmp && \
    # Copy necessary config files
    cp /etc/passwd /app/rootfs/etc/ 2>/dev/null || true && \
    cp /etc/group /app/rootfs/etc/ 2>/dev/null || true && \
    echo "root:x:0:0:root:/root:/bin/bash" > /app/rootfs/etc/passwd && \
    echo "user:x:1000:1000:user:/home/user:/bin/bash" >> /app/rootfs/etc/passwd && \
    # Create profile.d directory for startup scripts
    mkdir -p /app/rootfs/etc/profile.d

# Add restricted cd function to prevent navigating outside home directory
RUN echo '# OS Lab Restricted Shell - prevents navigating outside home directory\n\
    if [ -n "$OSLAB_ROOT" ]; then\n\
    cd() {\n\
    local target="${1:-$HOME}"\n\
    local abs_path\n\
    local current_dir\n\
    current_dir="$(pwd)"\n\
    \n\
    if [ "$target" = "-" ]; then\n\
    if [ -n "$OLDPWD" ]; then\n\
    target="$OLDPWD"\n\
    else\n\
    echo "cd: OLDPWD not set"\n\
    return 1\n\
    fi\n\
    fi\n\
    \n\
    if [[ "$target" = /* ]]; then\n\
    abs_path="$target"\n\
    elif [[ "$target" = "~" ]]; then\n\
    abs_path="$HOME"\n\
    elif [[ "$target" = "~/"* ]]; then\n\
    abs_path="${HOME}/${target:2}"\n\
    else\n\
    abs_path="$current_dir/$target"\n\
    fi\n\
    \n\
    if command -v realpath &>/dev/null; then\n\
    abs_path=$(realpath -m "$abs_path" 2>/dev/null) || abs_path="$abs_path"\n\
    fi\n\
    \n\
    abs_path="${abs_path%/}"\n\
    local root="${OSLAB_ROOT%/}"\n\
    \n\
    if [[ "$abs_path" == "$root" ]] || [[ "$abs_path" == "$root/"* ]]; then\n\
    if [ -d "$abs_path" ]; then\n\
    builtin cd "$abs_path" || return 1\n\
    else\n\
    echo "cd: $target: No such file or directory"\n\
    return 1\n\
    fi\n\
    else\n\
    echo "cd: Permission denied - cannot navigate outside your home folder"\n\
    return 1\n\
    fi\n\
    }\n\
    pushd() { echo "pushd: Permission denied - restricted shell"; return 1; }\n\
    popd() { echo "popd: Permission denied - restricted shell"; return 1; }\n\
    fi\n' > /app/rootfs/etc/profile.d/oslab_restrict.sh && \
    chmod +x /app/rootfs/etc/profile.d/oslab_restrict.sh

# Create directory for user sessions
RUN mkdir -p /app/sessions /home/users && \
    chmod 777 /home/users

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
