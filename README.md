# jonogon
A citizen petition platform for Bangladesh 2.0

# Development

## Philosophies

Just one for now:

To ensure participation, we want to keep the project as abstraction free as possible,
and when we do use an abstraction (sometimes a necessary evil for simplicity), we want to keep them
as simple and leak-free as possible.

## Stack

TODO

## Requirements

- Docker >= 26.1.4

## Quick Start

```bash
git clone git@github.com:jonogon/jonogon-mono.git
cd jonogon-mono

# ----------- feel free to run the below commands
# whenever you do a `git pull` ------------------

# install dependencies
docker compose run --build --rm mono pnpm install

# run migrations
docker compose run --rm -w /mono/misc/migrator mono pnpm run migration up

# start
docker compose up --remove-orphans
```

> If you're encountering difficulties with Docker,
> such as automatic updates not functioning, consider using Windows Subsystem for Linux (WSL). Click [here](#docker-with-wsl-setup) for a comprehensive guide.

### DevMode Authentication

- All OTPs sent in dev mode will be visible exclusively on the console.
- The OTP for `01111111111` is hard coded to be `1111` only in dev mode.

## Migrations
Database migrations are done via [node-pg-migrate](https://salsita.github.io/node-pg-migrate/). The migrator tool
can be found in `/misc/migrator`.

### Create Migration

```bash
# `--no-deps` because creating migrations does not require the database containers
docker compose run --rm --no-deps -w /mono/misc/migrator mono pnpm run migration create $MIGRATION_FILE_NAME
```

### Run Migrations

```bash
# up
docker compose run --rm -w /mono/misc/migrator mono pnpm run migration up

# down
docker compose run --rm -w /mono/misc/migrator mono pnpm run migration down
```

## Postgres

### Codegen for kysely

```bash
docker compose run --rm -w /mono/apps/jonogon-core mono pnpm run kysely:codegen
```

## tRPC

### Playground

Once you have the server running, you can access the tRPC playground
at [`http://localhost:12001/trpc-playground`](http://localhost:12001/trpc-playground).
_This is only available in dev mode, and not in production._

#### Authenticating Playground

1. Complete the login flow at [`http://localhost:12002/login`](http://localhost:12002/login)
2. While at [`http://localhost:12002/`](http://localhost:12002/), open the browser console.
3. Run the following script and copy the token `JSON.parse(window.localStorage.getItem('auth:token')).token`
4. Go to the Playground.
5. Open "Settings" from the top right corner.
6. Create a header called `Authorization` and paste the token as the value in the format `Bearer {TOKEN}`.

## Helpful Links

- [DOCKER-WSL-SETUP.md](https://github.com/jonogon/jonogon-mono/blob/master/DOCKER-WSL-SETUP.md) for setting up docker with WSL.
- [RESOURCES.md](https://github.com/jonogon/jonogon-mono/blob/master/RESOURCES.md) for useful resources to get started.