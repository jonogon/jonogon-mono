FROM node:22.6.0-alpine3.20 AS common
WORKDIR /app

FROM common AS build
COPY . /app
RUN npm install -g pnpm@9.7.0
RUN pnpm install
RUN pnpm build
RUN pnpm --filter=@jonogon/core --prod deploy pruned

FROM common

ENV NODE_ENV=production
COPY --from=build /app/pruned .

CMD node .
