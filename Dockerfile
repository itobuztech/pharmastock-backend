FROM node:20-alpine
RUN apk add --update --no-cache postgresql-client nano sudo
RUN mkdir /app 
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install --g prisma@5.16.1
RUN yarn
COPY . ./
RUN npx prisma generate
CMD bin/entrypoint.sh
