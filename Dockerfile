FROM node:22.6.0-bookworm

RUN corepack enable pnpm
RUN pnpm config set store-dir /pnpm-store


