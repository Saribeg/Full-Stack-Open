# Use slim variant with reduced size, fewer unused libraries → smaller & safer image
FROM node:22-bookworm-slim

# Install dumb-init:
# - ensures proper signal forwarding and process reaping (PID 1 issue in containers)
# - --no-install-recommends keeps image small
# - rm -rf /var/lib/apt/lists/* cleans up apt cache → smaller image layer
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

# Many Node.js packages behave differently (e.g., skip dev-only logic).
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json
# → ensures that "npm ci" is re-run only if dependencies change
COPY package*.json ./

# Install dependencies based on the lockfile
# → runs once and is reused from cache until manifests change
RUN npm ci --omit=dev

# Copy the rest of the source code
# → app code can change often without forcing reinstall of dependencies
COPY --chown=node:node . .

USER node

EXPOSE 3000

# Use dumb-init as entrypoint:
# - runs as PID 1 and forwards signals to Node.js properly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Final command to start the application directly with Node.js
# - avoids wrapping via npm/yarn (which would swallow signals)
CMD ["node", "./bin/www"]