FROM node:20-alpine

# Устанавливаем OpenSSL (требуется для Prisma на Alpine Linux)
RUN apk add --no-cache openssl

WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package*.json ./
RUN npm install

# Копируем весь остальной код проекта
COPY . .

# ⚠️ ОБЯЗАТЕЛЬНЫЙ ШАГ: Генерируем клиент Prisma
RUN npx prisma generate

# Указываем порт (совпадает с вашим .env)
EXPOSE 3001

# Команда запуска
CMD ["npm", "run", "dev"]
