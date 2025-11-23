# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the top-level package.json and install server dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source code
COPY . .

# The `postinstall` script in package.json will automatically
# change to the /client directory, install its dependencies, and build the React app.

# The space will be available at port 7860
EXPOSE 7860

# Command to run the Node.js server
CMD [ "npm", "start" ]
