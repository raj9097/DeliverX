# Stage 1: Build frontend
FROM node:18-alpine AS frontend

WORKDIR /app/frontend

# Copy package files
COPY package*.json ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install dependencies
RUN npm ci

# Copy source files
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build the frontend
RUN npm run build

# Stage 2: Backend
FROM node:18-alpine AS backend

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend files
COPY backend/ ./backend/
COPY backend/models/ ./backend/models/
COPY backend/middleware/ ./backend/middleware/
COPY backend/scripts/ ./backend/scripts/

# Create production environment file
RUN echo "MONGO_URI=mongodb://localhost:27017/DeliverX" > .env
RUN echo "PORT=5000" >> .env
RUN echo "NODE_ENV=production" >> .env

# Stage 3: Production
FROM node:18-alpine

WORKDIR /app

# Copy backend from stage 2
COPY --from=backend /app/backend ./backend

# Copy built frontend from stage 1
COPY --from=frontend /app/frontend/dist ./frontend/dist

# Install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "backend/server.js"]
