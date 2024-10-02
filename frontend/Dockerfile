FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY vite.config.ts ./

RUN npm i

COPY . .


EXPOSE 8080
RUN npm install typescript
Run npm i @rollup/rollup-linux-x64-gnu --save-optional

CMD ["npm", "run", "preview"]