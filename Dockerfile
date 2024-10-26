FROM node:21.7.3-alpine
WORKDIR /usr/src/app
RUN chown node:node ./
USER node

COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
RUN node src/register-commands
EXPOSE 3000
CMD ["node", "src/index"]