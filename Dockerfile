# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Install LibreOffice and fonts for PDF conversion
# --no-install-recommends helps keep the image size smaller
RUN apt-get update && apt-get install -y \
    libreoffice \
    fonts-liberation \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy build output and node_modules from builder
# Note: In a real production setup, we might want to prune devDependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create uploads directory with appropriate permissions
RUN mkdir -p uploads && chmod 777 uploads

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
