# ---------- STAGE 1: Build Stage ----------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source code
COPY ./src ./src

# Build TypeScript -> JavaScript
RUN npm run build


# ---------- STAGE 2: Production Stage ----------
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm ci --only=production

# Expose port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]