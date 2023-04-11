FROM node:18.14.0-alpine

WORKDIR /var/www/app/chat

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "./server.js"]
