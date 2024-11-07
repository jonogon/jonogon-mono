FROM node:22.6.0-bookworm

RUN npm install -g pnpm@9.12.0
RUN npm install -g firebase-tools@13.20.2

RUN wget -qO - https://github.com/omranjamal/mono-cd/releases/latest/download/docker-install.sh | sh -

