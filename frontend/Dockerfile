# Usa la imagen base node:18-alpine
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo package.json y instala las dependencias
COPY package.json .

RUN npm install

# Instala las dependencias necesarias para Playwright y los navegadores
RUN apk add --no-cache \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    fontconfig \
    ttf-freefont \
    bash \
    && npx playwright install --with-deps

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto que usas en el servidor de desarrollo
EXPOSE 5173

# Comando para ejecutar la aplicación
CMD [ "npm", "run", "dev" ]
