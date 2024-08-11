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