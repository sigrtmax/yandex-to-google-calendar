# Используем официальный образ Node.js (версия 18, можно изменить при необходимости)
FROM node:22.14.0

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json (если есть) для установки зависимостей
COPY package*.json ./

RUN npm install pm2 -g

# Устанавливаем зависимости
RUN npm install --production


# Копируем весь код приложения в контейнер
COPY . .

# Указываем команду для запуска приложения
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

