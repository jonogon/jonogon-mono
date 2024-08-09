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
- Node.js >= 22.6.0 (you can use [Volta](https://volta.sh/) to manage Node.js versions)
- pnpm >= 9.6.0 (Install: `npm install -g pnpm`)

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

#### Run

```bash
docker compose up --build --remove-orphans
```
