# ---------------------------------------
# Stage 1: Build backend dependencies
# ---------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (include dev for build)
RUN npm ci && npm cache clean --force

# Copy all source code
COPY . .

# ---------------------------------------
# Stage 2: Production image
# ---------------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy backend and service code from build stage
COPY --from=build /app/server ./server
COPY --from=build /app/service ./service

# Create empty placeholder (real .env loaded from EC2)
RUN touch .env

# Create non-root user for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs && chown -R nodejs:nodejs /app
USER nodejs

# Expose backend port
EXPOSE 5000

# Healthcheck to ensure backend is alive
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', ()=>process.exit(1))"

# Start backend server
CMD ["npm", "run", "server"]
