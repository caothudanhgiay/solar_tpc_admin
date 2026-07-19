# Stage 1: Build the Vue application
# Dùng node:22-slim (Debian/glibc) thay Alpine (musl) vì Vite 8/rolldown
# native bindings chỉ tương thích tốt với glibc, không phải musl
FROM node:22-slim AS builder

WORKDIR /app

# Copy package files và install dependencies
# Dùng npm install thay npm ci để npm tự resolve đúng
# platform-specific optional dependencies (rolldown native binding)
COPY package.json ./
RUN npm install

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
