# Backend + Email Service Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy backend and service code
COPY server ./server
COPY service ./service

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "run", "server"]
