FROM node:12.18.0-stretch-slim

COPY / /

RUN npm install

CMD npm run test:unit