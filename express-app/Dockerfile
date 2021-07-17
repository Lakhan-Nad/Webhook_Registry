FROM node:15.14.0

ENV NODE_ENV=production

WORKDIR /express

ENV PATH /express/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]