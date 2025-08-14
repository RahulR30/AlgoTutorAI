# Use official Node.js runtime as base
FROM node:18-alpine

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create a symlink for python3 -> python
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the app
CMD ["npm", "start"]
