# INSTRUCTIONS

## Installation

If you don't have pnpm installed run

```bash
npm i -g pnpm
```

After cloning the repo, run

```bash
pnpm i
```

to install packages.

Don't forget to set your env variables based on the .env.sample provided and modify value to match your config

```bash
cp .env.sample .env
```

##### Before start

You must have a Mongo database running somewhere and set the connection url in your `.env` file.

## START

Run

```bash
pnpm dev
```

and you can start to use the service.

For the sake of simplicity, two participants are seeded on service start with their infos logs in the terminal to tests routes

### TESTS

You can run tests using

```bash
pnpm test
```

and you can check coverage running

```bash
pnpm test:cov
```

### PROD

Run the build command

```bash
pnpm build
```

it will create a `dist/` folder with the compiled code.

You can then run

```bash
node dist/index.js
```

to execute it.
