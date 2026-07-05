# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /app

# Install required tooling for development workflows
RUN apk add --no-cache bash git ripgrep

# Pin npm version for deterministic installs in devcontainers/CI
RUN npm install -g npm@11.18.0

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build and run tests
RUN npm run build && npm run test


# Stage 2: Runtime (minimal, for CI/publishing artifact verification)
FROM node:lts-alpine AS runtime

WORKDIR /app

# Install required tooling for devcontainer shells
RUN apk add --no-cache bash git ripgrep

# Pin npm version for interactive devcontainer usage
RUN npm install -g npm@11.18.0

# Copy only package.json and lock file for reference
COPY package*.json ./

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Metadata
LABEL maintainer="haskelito"
LABEL description="Haskelito - Functional programming library for JavaScript"

# Health check (verify dist exists)
HEALTHCHECK --interval=30s --timeout=3s --start-period=1s --retries=3 \
    CMD test -d ./dist && echo "Build artifacts present" || exit 1
