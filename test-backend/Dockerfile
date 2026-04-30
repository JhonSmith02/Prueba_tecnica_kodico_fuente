# test-backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Instalamos dependencias y generamos el cliente de Prisma
RUN npm ci
RUN npx prisma generate

# Copiamos el resto del código
COPY . .

# Exponemos el puerto
EXPOSE 3000

# Comando para iniciar: Empuja el esquema, siembra los datos y levanta el servidor
CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm run dev"]