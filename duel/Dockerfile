# Stage-1
FROM  node:latest AS builder

WORKDIR /app

COPY package.json .
RUN chown -R root /app
RUN npm install

COPY .. .

RUN npm run build

# Stage-2
FROM nginx:1.25.2-alpine-slim

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]