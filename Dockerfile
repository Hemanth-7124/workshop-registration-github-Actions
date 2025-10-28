# Use Node.js 20 LTS as the base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Nuxt application (optional if you want frontend dev server)
RUN npm run build

# Create a startup script to validate EmailService integration
RUN echo '#!/bin/sh\n\
echo "🔧 Validating EmailService integration..."\n\
\n\
# Check if EmailService module can be imported\n\
node -e "import(\"./service/emailService.js\").then(() => console.log(\"✅ EmailService module loaded successfully\")).catch(err => { console.error(\"❌ EmailService module failed to load:\", err.message); process.exit(1); })"\n\
\n\
# Check if createRegistration function imports EmailService\n\
node -e "import(\"./server/controllers/registrationController.js\").then(() => console.log(\"✅ RegistrationController with EmailService loaded successfully\")).catch(err => { console.error(\"❌ RegistrationController failed to load:\", err.message); process.exit(1); })"\n\
\n\
# Validate required environment variables for EmailService\n\
echo "📧 Checking EmailService environment variables..."\n\
[ -z \"$SMTP_HOST\" ] && echo "⚠️  Warning: SMTP_HOST not set (using default: smtp.gmail.com)" || echo "✅ SMTP_HOST: $SMTP_HOST"\n\
[ -z \"$SMTP_USER\" ] && echo "⚠️  Warning: SMTP_USER not set" || echo "✅ SMTP_USER: $SMTP_USER"\n\
[ -z \"$FROM_EMAIL\" ] && echo "⚠️  Warning: FROM_EMAIL not set" || echo "✅ FROM_EMAIL: $FROM_EMAIL"\n\
\n\
echo "🚀 Starting application..."\n\
exec "$@"' > /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001 \
    && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose backend and frontend ports for local testing
EXPOSE 5000

# Health check (optional, can skip in local dev)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use the entrypoint script to validate EmailService integration before starting
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Start the application in development mode
CMD ["npm", "run", "server:dev"]
