FROM node:8.10.0-alpine

# Create app directory
#WORKDIR /Users/mac/Documents/DemoProjects/clear_docker_v1
WORKDIR /home/usr/app

# Install Utilities
RUN apk add --no-cache git

RUN apk add --no-cache bash

#make the logfile directory
RUN mkdir log

ENV LOG_FOLDER /home/usr/app/log


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN pwd
# Install bower packages
#COPY bower.json ./
#COPY .bowerrc ./

#RUN bower install ./
RUN npm install --production
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.1/wait /wait
RUN chmod +x /wait

CMD  /wait && [ "node", "server.js"]
