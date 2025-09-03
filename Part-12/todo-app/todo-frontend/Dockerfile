FROM node:22-bookworm-slim AS build-stage

ENV VITE_BACKEND_URL=http://localhost:3000/

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html