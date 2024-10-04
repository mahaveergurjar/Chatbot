# 1. Use an official Node.js image with a version compatible with Electron
FROM node:18-buster-slim

# 2. Install necessary dependencies for Electron, including Xvfb (virtual display) and other GUI-related dependencies
RUN apt-get update && apt-get install -y \
  xvfb \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libnss3 \
  libdrm2 \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Set the working directory inside the container
WORKDIR /app

# 4. Copy package.json and package-lock.json first for better build caching
COPY package*.json ./

# 5. Install only production dependencies (if needed, modify for development dependencies)
RUN npm install --only=production

# 6. Copy the rest of the application code
COPY . .

# 7. Expose the port if Electron communicates on a specific port (optional)
# EXPOSE 3000

# 8. Set environment variables, e.g., API keys (optional)
# ENV API_KEY="AIzaSyDTRcDDG_KA7GIx13hgADcDD0QT1FWGh8I"

# 9. Start the virtual display and run the Electron application
CMD ["xvfb-run", "--auto-servernum", "--server-args='-screen 0 1024x768x24'", "npm", "start"]
