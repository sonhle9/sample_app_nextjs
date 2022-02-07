FROM node:10.16.0

WORKDIR /app
RUN npm install http-server -g

RUN mkdir web-ops
COPY /dist/ ./web-ops

EXPOSE 8080

CMD [ "http-server"]
