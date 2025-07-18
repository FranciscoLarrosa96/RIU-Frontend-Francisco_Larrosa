# Etapa 1: Build del proyecto
FROM node:22.12 AS builder


WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --configuration=production

# Etapa 2: Servir con NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/RIU-FrontEnd-Francisco_Larrosa/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
