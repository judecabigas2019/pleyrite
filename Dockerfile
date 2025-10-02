# Use Node.js base
FROM mcr.microsoft.com/playwright:v1.47.2-jammy

# Create app dir
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install deps
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Run
CMD ["npm", "start"]
