FROM golang:1.18-alpine

# Install base dependencies
RUN apk add \
        bash \
        yarn  \
        curl \
        git \
        nano \
        wget   

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.12.1

WORKDIR $NVM_DIR

RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN corepack enable
RUN corepack prepare yarn@stable --activate

EXPOSE 8000
EXPOSE 8001
EXPOSE 8002
EXPOSE 3033
EXPOSE 3478
EXPOSE 3478/udp
EXPOSE 49152-65535/udp

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
# CMD [ "yarn", "start"]