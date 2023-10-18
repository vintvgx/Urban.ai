
# Build React client
FROM node:18.17.1 AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Set up Express server
FROM node:18.17.1

WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./

# Copy React build from the first stage
COPY --from=client-build /app/client/build /app/server/client/build

# Expose the API server port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]  
