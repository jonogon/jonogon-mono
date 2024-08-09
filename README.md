# jonogon
A citizen petition platform for Bangladesh 2.0

## Development

### Philosophies

Just one for now:

To ensure participation, we want to keep the project as abstraction free as possible,
and when we do use an abstraction (sometimes a necessary evil for simplicity), we want to keep them
as simple and leak-free as possible.

### Stack

TODO

### Requirements

- Docker >= 26.1.4

### Quick Start

#### Clone the Repo

```bash
git clone git@github.com:jonogon/jonogon-mono.git
```

#### Install Dependencies

```bash
cd jonogon-mono
docker compose run --rm mono pnpm install
```

#### Run Migrations

```bash
docker compose run --rm -w /mono/misc/migrator mono pnpm run migration up
```

#### Start

```bash
docker compose up --build --remove-orphans
```
