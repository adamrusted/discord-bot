FROM node:21.1.0-alpine
WORKDIR /usr/src/app
RUN chown node:node ./
USER node

COPY package.json package-lock.json ./
RUN npm ci
COPY src ./src
RUN node src/register-commands
CMD ["node", "src/index"]