FROM node:22.6.0-alpine3.20 AS common
RUN npm install -g pnpm@9.7.0
WORKDIR /app

FROM common AS build
COPY . /app
RUN pnpm install
RUN pnpm build

FROM common AS production
COPY --from=build /app/dist/ /app/dist/
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/
ENV NODE_ENV=production
RUN pnpm install --prod --frozen-lockfile

CMD ["pnpm", "start"]
