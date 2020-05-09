FROM node:12.12.0-alpine

WORKDIR /usr/src/app
COPY ./src ./

RUN npm update && \
    npm install -g npm @vue/cli
RUN chmod -R 777 ./
