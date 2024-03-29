FROM node:14

WORKDIR /usr/src/app

COPY package* ./

RUN npm install && npm update

COPY . .

CMD ["npm", "run", "start"]