FROM node:18.16.0-slim
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

ENV APP_PORT=4500

EXPOSE 4500
CMD ["node", "app.js"]