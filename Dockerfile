# Use an outdated Node.js base image with known vulnerabilities
FROM node:14.15.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including vulnerable ones)
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Create a non-root user but with potential privilege escalation issues
RUN useradd -m -s /bin/bash appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Start the application
CMD ["npm", "start"]
