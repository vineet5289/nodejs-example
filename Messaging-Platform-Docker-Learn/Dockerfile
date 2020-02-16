FROM alpine

LABEL maintainer "vineet5289@gmail.com"

RUN apk add --update nodejs nodejs-npm

COPY . /src

WORKDIR /src

RUN npm install

EXPOSE 5200

ENTRYPOINT ["node", "./src/server.js"]