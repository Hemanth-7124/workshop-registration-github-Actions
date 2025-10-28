# ---------------------------------------
# Stage 1: Build backend dependencies
# ---------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies (include dev if needed for backend build)
RUN npm ci && npm cache clean --force

# Copy full project
COPY . .

# ---------------------------------------
# Stage 2: Production backend image
# ---------------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy backend and service folders from build stage
COPY --from=build /app/server ./server
COPY --from=build /app/service ./service

# Create .env placeholder (actual .env added at runtime via docker run --env-file)
RUN touch .env

# Create secure non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs && chown -R nodejs:nodejs /app
USER nodejs

# Expose backend port
EXPOSE 5000

# Healthcheck to verify service is alive
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', ()=>process.exit(1))"

# Start backend server
CMD ["npm", "run", "server"]
