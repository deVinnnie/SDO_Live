FROM node:10.16-alpine

WORKDIR /usr/src/app

RUN apk --no-cache add curl

COPY . .

RUN npm install && npm run build && npm prune --production

RUN mkdir -p ./static/feed/

EXPOSE 3000

CMD [ "npm", "start" ]
