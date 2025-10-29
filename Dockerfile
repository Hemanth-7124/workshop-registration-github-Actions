# Backend + Email Service Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy only server/service package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy backend and service code
COPY server ./server
COPY service ./service
COPY .env .env

EXPOSE 5000

CMD ["npm", "run", "server"]
