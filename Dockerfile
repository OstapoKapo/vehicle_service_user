FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .



FROM node:20-alpine AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/app .


# Створюємо безпечного користувача
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD [ "node", "index.js" ]