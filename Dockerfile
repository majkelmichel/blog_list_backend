FROM node:14

WORKDIR /usr/src/app

COPY . .

ENV MONGODB_URI=${MONGODB_URI}

RUN ["npm", "install"]

CMD ["npm", "start"]