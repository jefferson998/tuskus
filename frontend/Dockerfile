FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm install playwright
RUN npx playwright install --with-deps
COPY . .

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
    ttf-freefont

EXPOSE 5173

CMD [ "npm", "run", "dev" ]