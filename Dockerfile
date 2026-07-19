# Stage 1: Build the Vue application
FROM node:20-alpine AS builder

# libc6-compat cần thiết cho Alpine và một số native bindings (rolldown, etc.)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json ./

# Dùng npm install (không dùng npm ci) để npm tự resolve đúng
# platform-specific optional dependencies cho linux-x64-musl (rolldown native binding của Vite 8)
RUN npm install --prefer-offline

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
