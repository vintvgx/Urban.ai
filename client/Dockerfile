# Build React app with Node.js
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build --prod

# Setup Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
