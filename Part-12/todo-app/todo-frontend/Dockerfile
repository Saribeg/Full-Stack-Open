# Multi-stage Dockerfile using DRY principles.
# Each stage builds on top of the previous one, reusing results instead of repeating work.
# "FROM X AS Y" creates a named stage (Y) that can be reused later.

# Deps: install only dependencies (node_modules).
FROM node:22-bookworm-slim AS deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# Test: copy source code and run unit tests.
FROM deps AS test-stage

COPY . .

RUN npm run test:ci

# Build: start from tested code and create production-ready static files.
# No need to COPY source again, because build-stage inherits everything from test-stage.
# Docker does not duplicate files here: it reuses the snapshot of test-stage (like a git commit).
FROM test-stage AS build-stage

ARG VITE_BACKEND_URL=/api

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN npm run build

# Serve: final lightweight image with only Nginx + static files.
FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html