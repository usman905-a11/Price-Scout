# Use an official Node.js runtime as a parent image. 
# Using a specific version like '20-slim' is recommended for stability.
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock, etc.)
# This leverages Docker's layer caching. The npm install step will only re-run if these files change.
COPY package*.json ./

# Install all dependencies, including devDependencies needed for the build step (like 'vite').
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Build the Vite project for production. This creates a 'dist' folder.
RUN npm run build

# Hugging Face Spaces expose port 7860 by default.
EXPOSE 7860

# The 'preview' script serves the built files from the 'dist' folder.
# We add '--host' to make it accessible from outside the container
# and '--port' to match the exposed port for Hugging Face.
CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "7860" ]
