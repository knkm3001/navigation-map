FROM node:12.12.0-alpine

WORKDIR /usr/src/app
COPY ./navigation-map ./

RUN npm update && \
    npm install
RUN chmod -R 777 ./
