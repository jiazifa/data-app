# Use the official Node.js image as the base image
FROM node:18-alpine

# Set Env
ENV DATABASE_URL="file:./db.sqlite"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

COPY pnpm-lock.yaml ./

# Install project dependencies
RUN pnpm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the Next.js app
RUN pnpm run build

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
