# [Choice] Debian OS version: bullseye, buster
FROM --platform=linux/amd64 mcr.microsoft.com/devcontainers/typescript-node:1-18-bookworm

ARG USERNAME="root"
ARG GROUP="root"

ARG USER_UID=1000
ARG USER_GID=${USER_UID}

# Configure apt
ENV DEBIAN_FRONTEND=noninteractive

# Make variables available in Shell Env
ENV USERNAME=${USERNAME}
ENV GROUP=${GROUP}

# Create the user
# RUN groupadd --gid $USER_GID $USERNAME \
#     && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
#     #
#     # [Optional] Add sudo support. Omit if you don't need to install software after connecting.
#     && apt-get update \
#     && apt-get install -y sudo \
#     && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
#     && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME

# Install Go
ENV GO_VERSION=1.17.2
RUN wget https://dl.google.com/go/go$GO_VERSION.linux-amd64.tar.gz -O go.tar.gz && \
    sudo tar -C /usr/local -xzf go.tar.gz && \
    rm go.tar.gz && \
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.zshrc

# Set up zsh and other tools
RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.1.5/zsh-in-docker.sh)" -- \
    -p git \
    -p node \
    -p azure \
    -p github \
    -p themes \
    -p copyfile \
    # -p dotenv \
    -p yarn \
    -p https://github.com/zsh-users/zsh-autosuggestions \
    -p https://github.com/zsh-users/zsh-completions 
    # \ -a 'ZSH_DOTENV_PROMPT=false'
