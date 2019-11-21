# base image
FROM node:12.2.0-alpine

# Set Environment variables
ENV REACT_APP_ENVIRONMENT prod

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY . ./

RUN npm install

# start app
CMD ["npm", "start"]