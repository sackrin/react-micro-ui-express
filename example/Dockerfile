FROM node:10-alpine
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
# Make the assets and server directories
# This is where the built assets will be placed
RUN mkdir /opt/app/.assets \
  && mkdir /opt/app/.server
# Set our working directory to the app directory
WORKDIR /opt/app
# Expose port 8080 which is the production port
EXPOSE 8080
# Copy the package and package-lock files
COPY package*.json ./
# Install in production mode
RUN npm i
# Copy all non docker ignored files
COPY . .
## Run the deploy build nps script
RUN npm config set unsafe-perm true \
  && npx nps build
# Remove the src and srv folders
# These are not needed as all code has been built
RUN rm -r src
# Run as non root user "node" from now on
USER node
# Run the built server code
CMD ["node", ".server/server.js"]
