FROM node:22-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_REDUX_URL=/redux/
ARG VITE_QUERY_URL=/query/

ENV VITE_REDUX_URL=${VITE_REDUX_URL}
ENV VITE_QUERY_URL=${VITE_QUERY_URL}

RUN npm run build