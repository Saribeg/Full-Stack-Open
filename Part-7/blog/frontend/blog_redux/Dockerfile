FROM node:22-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ARG VITE_BASE_PATH=/redux/

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

RUN npm run build