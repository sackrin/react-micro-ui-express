FROM node:10-alpine as BUILD
# Allow both the environment ID and node env to be passed in at build time
ARG NODE_ENV=production
# Set the enrivonment vars according to the passed args
ENV NODE_ENV=$NODE_ENV
# Create the application directory
RUN mkdir /opt/app
# Make the assets and server directories
# This is where the built assets will be placed
RUN mkdir /opt/app/.assets \
  && mkdir /opt/app/.server
# Set our working directory to the app directory
WORKDIR /opt/app
# Copy the package and package-lock files
COPY package*.json ./
# Install deps
RUN npm i
# Copy all non docker ignored files
COPY . .
## Run the deploy build nps script
RUN npm config set unsafe-perm true \
  && npx nps build

FROM node:10-alpine as SERVER
# Allow both the environment ID and node env to be passed in at build time
ARG NODE_ENV=production
# Set the enrivonment vars according to the passed args
ENV NODE_ENV=$NODE_ENV
## Add hardening scripts
ADD .docker/harden.sh /opt/harden.sh
ADD .docker/sysctl.conf /etc/sysctl.conf
## Update packages
RUN apk --no-cache update && \
  apk --no-cache upgrade
## Install Python
RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*
## Execute hardening scripts
RUN chmod +x /opt/harden.sh && \
  /opt/harden.sh && \
  rm -f /opt/harden.sh
# Create the application directory
RUN mkdir /opt/app
# Set our working directory to the app directory
WORKDIR /opt/app
# Copy the package and package-lock files
COPY package*.json ./
# Install in production mode
RUN npm ci --prod
# Copy the allowed files to the image
# You may need to add more for your production build
COPY --from=BUILD /opt/app/microui.config.js .
COPY --from=BUILD /opt/app/.assets ./.assets
COPY --from=BUILD /opt/app/.server ./.server
# Run as non root user "node" from now on
USER node
# Expose port 8080 which is the production port
EXPOSE 8080
# Run the built server code
CMD ["node", ".server/server.js"]
