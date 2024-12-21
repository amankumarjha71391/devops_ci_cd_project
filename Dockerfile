# official Node.js image to build the app
FROM node:18

# working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Serve the app using a simple static server
RUN npm install -g serve

# Expose port 3000 for the React app
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
