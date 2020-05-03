FROM node:13

# Map Args to Env. Is needed due to Webpack build
ARG BASE_URL=""
ARG BASE_PORT=""
ARG BACKEND_URL=""
ARG BACKEND_PORT=""
ARG GOOGLE_API_KEY=""

ENV BASE_URL=$BASE_URL
ENV BASE_PORT=$BASE_PORT
ENV BACKEND_URL=$BACKEND_URL
ENV BACKEND_PORT=$BACKEND_PORT
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

COPY . /opt/helpmeifyoucan/
WORKDIR /opt/helpmeifyoucan/

# Install application dependencies
RUN npm install && npm run build

ENTRYPOINT [ "npm", "run", "start" ]
