FROM node:22.6.0-bookworm

RUN npm install -g pnpm@9.7.0

WORKDIR /app

COPY . /app

RUN pnpm install
RUN pnpm build

CMD pnpm start
