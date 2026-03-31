# OpenZeppelin Relayer Dockerfile
FROM rust:1.86-bookworm as builder

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libsodium-dev \
    && rm -rf /var/lib/apt/lists/*

# Clone OpenZeppelin Relayer
RUN git clone https://github.com/OpenZeppelin/openzeppelin-relayer.git /relayer
WORKDIR /relayer
RUN cargo build --release

# Runtime image
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    libsodium23 \
    && rm -rf /var/lib/apt/lists/*

# Copy built relayer
COPY --from=builder /relayer/target/release/relayer /usr/local/bin/
COPY --from=builder /relayer /app

EXPOSE 8080

CMD ["relayer", "--config", "/app/config/config.json"]
