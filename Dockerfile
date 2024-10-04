# Use a Node.js base image
FROM node:19.2

# Install necessary libraries for Electron
RUN apt-get update && apt-get install -y \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxtst6 \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxss1 \
    libasound2 \
    libdrm2 \
    libgbm1 \
    libglvnd-dev \
    dbus \
    nano \
    xauth && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the application files into the container
COPY . .

# Change ownership of the application files
RUN chown -R node /app

# Switch to the node user
USER node

# Install Node.js dependencies
RUN npm install

# Switch back to root for sandboxing setup
USER root

# Set permissions for Electron's chrome-sandbox if it exists
RUN if [ -f /app/node_modules/electron/dist/chrome-sandbox ]; then \
        chown root /app/node_modules/electron/dist/chrome-sandbox && \
        chmod 4755 /app/node_modules/electron/dist/chrome-sandbox; \
    else \
        echo "chrome-sandbox not found"; \
    fi

# Switch back to the node user
USER node

# Command to run the application
CMD ["npm", "start"]