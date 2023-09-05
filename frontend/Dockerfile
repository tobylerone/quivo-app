FROM node:alpine

WORKDIR /language_app
COPY . .

RUN npm install --legacy-peer-deps

CMD ["npm", "run"]