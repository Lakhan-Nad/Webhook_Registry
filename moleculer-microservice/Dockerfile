FROM node:15.14.0

ENV NODE_ENV=production
ENV MONGO_URI=mongodb://localhost:27017/webhooks
ENV LOG_LEVEL=debug
ENV REDIS_URL=redis://localhost:6379
ENV MONGO_WEBHOOK_COLLECTION=webhooks
ENV SERVICES=dist/services

RUN mkdir /app
WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

CMD ["npm", "start"]