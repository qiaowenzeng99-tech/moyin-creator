# Build renderer artifacts from electron-vite project
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx electron-vite build

# Serve renderer output as static site
FROM nginx:1.27-alpine
COPY --from=builder /app/out/renderer /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
