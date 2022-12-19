FROM alfg/ffmpeg
WORKDIR /app

# Install base dependencies
RUN apk add \
        bash \
        yarn  \
        yasm \
        curl \
        git \
        wget   

######################################################################################################################

# Replace shell with bash so we can source files
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

EXPOSE 9996-9999

RUN corepack enable
RUN corepack prepare yarn@stable --activate

WORKDIR /app
COPY . .
RUN yarn install
CMD [ "yarn", "start"]