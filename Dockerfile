FROM node:carbon-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir ./static/feed/

EXPOSE 3000

CMD [ "npm", "start" ]
