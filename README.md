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

## Docker with WSL Setup

### Prerequisites:

- **Windows 10 (version 1903 or later) or Windows 11**
- **WSL 2 enabled:**

  1. Open PowerShell as administrator.
  2. Run `wsl --supported` to verify compatibility.
  3. If compatible, enable WSL 2 with: `wsl --set-default-version 2`

### Installation Steps:

1. **Install WSL 2 (if not already installed):**

   - Follow this YouTube tutorial: [https://youtu.be/eId6K8d0v6o](https://youtu.be/eId6K8d0v6o)
   - If Ubuntu is not installed for WSL, Run ```wsl --install --d Ubuntu``` to install it.

2. **Install Docker Desktop:**

   - Download and install the latest stable version of Docker Desktop from: [https://docs.docker.com/desktop/install/windows-install/](https://docs.docker.com/desktop/install/windows-install/)
   - During installation, ensure "Enable WSL 2 backend" is selected.

### Enabling WSL Integration in Docker Desktop:
1. Open terminal and switch to Ubuntu. ![Switching to Ubuntu](https://i.ibb.co/gtf7tMG/image.png)
2. Open Docker Desktop (has to be running in the background). 
3. Go to **Settings** > **General**.<br> ![Go to Settings](https://i.ibb.co/8D64v3z/image.png)
4. Under "WSL Integration," enable "Enable WSL 2 backend" (if not already enabled). ![Enable WSL 2 Backend](https://i.ibb.co/m6hfgDW/image.png) ![Enable Ubuntu from Resources > WSL integation](https://i.ibb.co/wc8sPg4/image.png)
5. If you have multiple WSL distributions, select your preferred one under "WSL Integation."
6. Now you can run everything from [Quick Start Guide](#quick-start) inside the Ubuntu console we opened in **Step #1**.

### Additional Notes:

- For advanced usage or troubleshooting, refer to the official Docker documentation on WSL integration: [https://docs.docker.com/go/wsl2/](https://docs.docker.com/go/wsl2/)


## Learning Resources

### Frontend ([Jonogon Web](https://github.com/0xriyadh/jonogon-mono/tree/main/apps/jonogon-web))

- JavaScript
    - [JavaScript Tutorial - W3Schools](https://www.w3schools.com/js/)
    - JavaScript Video Tutorial (English) [YouTube](https://www.youtube.com/watch?v=jS4aFq5-91M)
    - JavaScript Video Tutorial (Bangla) [YouTube](https://youtube.com/playlist?list=PLHiZ4m8vCp9OkrURufHpGUUTBjJhO9Ghy&si=T-3GMIiJXNei2Jo5)
- TypeScript
    - [TypeScript Tutorial - W3Schools](https://www.w3schools.com/typescript/)
    - TypeScript Video Tutorial (English) [YouTube](https://youtu.be/30LWjhZzg50?si=btNIlGOf8pi5OuU7)
    - TypeScript Tutorial (Bangla) [YouTube](https://youtube.com/playlist?list=PLHiZ4m8vCp9PgOOjdyNpc6AoBmKNrp_u3&si=ThEVykFUEIYyMYut)
- React
    - [React Tutorial - W3Schools](https://www.w3schools.com/react/)
    - React Video Tutorial (English) [YouTube](https://www.youtube.com/watch?v=bMknfKXIFA8&pp=ygURcmVhY3QgZnVsbCBjb3Vyc2U%3D)
    - React Video Tutorial (Bangla) [YouTube](https://youtube.com/playlist?list=PLHiZ4m8vCp9M6HVQv7a36cp8LKzyHIePr&si=hquNq4ICN8nF8mh2)
- Astro
  - Astro Video Tutorial 01 (English) [YouTube](https://youtu.be/e-hTm5VmofI?si=3boQEAisu5GVKtvH)
  - Astro Video Tutorial 02 (English) [YouTube](https://youtu.be/Oi9z5gfIHJs?si=o_YLZKPEDjyy7ZlJ)
- tRPC
  - tRPC Video Tutorial (English) [YouTube](https://youtu.be/UfUbBWIFdJs?si=309cuGsx01pJNoOS)
- TanStack Query
  - TanStack Query Video Tutorial (English) [YouTube](https://youtu.be/r8Dg0KVnfMA?si=Ymy8OtN87T_pUPJl)

### Backend ([Jonogon Core](https://github.com/0xriyadh/jonogon-mono/tree/main/apps/jonogon-core))

- JavaScript
    - [JavaScript Tutorial - W3Schools](https://www.w3schools.com/js/)
    - JavaScript Video Tutorial (English) [YouTube](https://www.youtube.com/watch?v=jS4aFq5-91M)
    - JavaScript Video Tutorial (Bangla) [YouTube](https://youtube.com/playlist?list=PLHiZ4m8vCp9OkrURufHpGUUTBjJhO9Ghy&si=T-3GMIiJXNei2Jo5)
- TypeScript
    - [TypeScript Tutorial - W3Schools](https://www.w3schools.com/typescript/)
    - TypeScript Video Tutorial (English) [YouTube](https://youtu.be/30LWjhZzg50?si=btNIlGOf8pi5OuU7)
    - TypeScript Tutorial (Bangla) [YouTube](https://youtube.com/playlist?list=PLHiZ4m8vCp9PgOOjdyNpc6AoBmKNrp_u3&si=ThEVykFUEIYyMYut)
- Node.js & Express.js
  - Node.js & Express.js Video Tutorial (English) [YouTube](https://youtu.be/Oe421EPjeBE?si=tIVEkbRiTryQgUVC)
  - Node.js & Express.js Video Tutorial (Bangla) [YouTube](https://youtube.com/playlist?list=PLHiZ4m8vCp9PHnOIT7gd30PCBoYCpGoQM&si=5e98lGMxxGc-NHZt)
- tRPC
  - tRPC Video Tutorial (English) [YouTube](https://youtu.be/UfUbBWIFdJs?si=309cuGsx01pJNoOS)
- PostgreSQL
  - PostgreSQL Course (English) [YouTube](https://youtu.be/qw--VYLpxG4?si=0ZkVc3_ZOiIbEr73)
- Redis
  - Redis Video Tutorial 01 (English) [YouTube](https://youtu.be/XCsS_NVAa1g?si=c4pI_WuFZ_kdoenG)
  - Redis Video Tutorial 02 (Hindi) [YouTube](https://youtu.be/Vx2zPMPvmug?si=9zLQefb21C4QnZVQ)
- Zod
  - Zod Video Tutorial 01 (English) [YouTube](https://youtu.be/L6BE-U3oy80?si=Ul4K7v2aVq99izMh)
  - Zod Video Tutorial 02 (English) [YouTube](https://youtu.be/AeQ3f4zmSMs?si=J4RqcGTEOqSG4Tzi)
