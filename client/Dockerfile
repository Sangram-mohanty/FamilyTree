# # ==========================================
# # Stage 1: Build the Angular Application
# # ==========================================
# FROM node:20-alpine AS builder
#
# WORKDIR /app
#
# # Copy package files first to leverage Docker layer caching
# COPY package*.json ./
#
# # Install dependencies cleanly
# RUN npm ci
#
# # Copy the rest of your Angular source code
# COPY . .
#
# # Build for production with memory cap for small EC2 instances
# RUN NODE_OPTIONS="--max-old-space-size=1536" npx ng build --configuration production --source-map=false
#
# # ==========================================
# # Stage 2: Serve with Lightweight Nginx
# # ==========================================
# FROM nginx:alpine
#
# # Remove default Nginx static assets
# RUN rm -rf /usr/share/nginx/html/*
#
# # Copy compiled Angular output from Stage 1
# # NOTE: Replace <your-app-name> with the "name" field in your package.json / angular.json
# # NOTE: If using Angular 16 or older, remove "/browser" from the path below
# COPY --from=builder /app/dist/<your-app-name>/browser /usr/share/nginx/html
#
# # Copy custom Nginx config for Angular routing & Express API proxy
# COPY nginx.conf /etc/nginx/conf.d/default.conf
#
# EXPOSE 80
#
# CMD ["nginx", "-g", "daemon off;"]


# ==========================================
# Stage 1: Build the Angular Application
# ==========================================
FROM node:26.13.1-alpine AS builder

WORKDIR /app

# Give the built-in 'node' user ownership of /app
RUN chown -R node:node /app

# Give the built-in 'node' user ownership of /app
COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npx ng build --configuration=production --source-map=false

# ==========================================
# Stage 2: Serve with Lightweight Nginx
# ==========================================
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled files from Stage 1's /home/node/app/dist path
# NOTE: Replace <your-app-name> with your project name from angular.json
# NOTE: Remove "/browser" if using Angular 16 or older
COPY --from=builder /app/dist/family-tree/browser /usr/share/nginx/html

# Copy custom Nginx config for Angular routing & Express API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
