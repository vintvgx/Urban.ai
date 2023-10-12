# Dockerfile Backend

# Use NodeJS v16
FROM node:16  

# Working directory inside the container
WORKDIR /app 

# Copy package.json and package-lock.json
COPY package*.json ./  

# Install dependencies
RUN npm install  

# Copy other source code files
COPY . .  

#Expose backend API port
EXPOSE 4000

# Define environment variable
ENV NAME URBAN_BACK

# Build Docker Image
RUN npm build    

# Copy into secondary Caddy stage
