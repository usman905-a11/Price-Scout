# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the React app for production
RUN npm run build

# Use a lightweight web server to serve the static files
RUN npm install -g serve

# The space will be available at port 7860
EXPOSE 7860

# Command to run the app
CMD ["serve", "-s", "build", "-l", "7860"]