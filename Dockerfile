# --- ЕТАП 1: "Builder" (Збірка) ---
FROM node:20 AS builder

# Встановлюємо робочу директорію
WORKDIR /usr/src/app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо всі залежності
RUN npm install

# Копіюємо решту коду проекту
COPY . .

# (Опціонально) Якщо ви використовуєте TypeScript, розкоментуйте:
# RUN npm run build


# --- ЕТАП 2: "Production" (Продакшн) ---
FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо *лише* продакшн-залежності
RUN npm ci --omit=dev

# Копіюємо зібраний код з етапу "builder"
COPY --from=builder /usr/src/app .
# (Якщо був етап 'RUN npm run build', то копіюйте зібрану папку, напр. './dist')
# COPY --from=builder /usr/src/app/dist ./dist

# Створюємо безпечного користувача
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# ВАЖЛИВО: Команда запуску
# 'server.js' - це ваш головний файл (може бути index.js, app.js тощо)
CMD [ "node", "index.js" ]