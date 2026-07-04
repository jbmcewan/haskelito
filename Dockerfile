# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build and run tests
RUN npm run build && npm run test


# Stage 2: Runtime (minimal, for CI/publishing artifact verification)
FROM node:20-alpine AS runtime

WORKDIR /app

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
