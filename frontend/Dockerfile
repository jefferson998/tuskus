FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install
RUN npx playwright install

COPY . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]