# VERSION:        0.3
# DESCRIPTION:    Image to build Atom (Electron 28 / Node 18)

FROM ubuntu:22.04

# Install system dependencies
RUN apt-get update && \
    DEBIAN_FRONTEND="noninteractive" \
    apt-get install -y \
        build-essential \
        git \
        curl \
        python3 \
        libsecret-1-dev \
        fakeroot \
        rpm \
        libx11-dev \
        libxkbfile-dev \
        libgdk-pixbuf2.0-dev \
        libgtk-3-dev \
        libxss-dev \
        libasound2-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Node.js 18 LTS via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Use python3 for node-gyp
RUN npm config set python /usr/bin/python3 -g

ENTRYPOINT ["/usr/bin/env", "sh", "-c"]
CMD ["bash"]
