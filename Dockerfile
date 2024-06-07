FROM node:21-1-0-alpine
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY src/* ./src/*
RUN node src/register-commands
RUN node src/index