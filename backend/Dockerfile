FROM node:20-alpine

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++ gcc libc6-compat

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose API port
EXPOSE 3000

# Start server
CMD ["node", "src/server.js"]
