# Nicolas Gretten backend test

## Installation
pnpm is needed
```bash
npm i -g pnpm
```

clone the repository and run
```bash
pnpm i
```

create the .env file
```bash
cp .env.sample .env
```

## MongoDB
At the root of the directory run
```bash
docker compose up -d
```

## Running the project
for running the tests
```bash
pnpm run test
```

for running the App in dev environment
```bash
pnpm run dev
```

The app can be tested with the swagger documentation at the url
```
localhost:3000/docs
```

At the start of the app, a seed of the database is done.
Two user are created.

You can use this email and password to log in
``` json
{
    "_id": "653ab2966484ef549fa00700",
    "email": "felix@visionspol.eu",
    "password": "00000000"
},
{
    "_id": "653a4f1d421a5f6dfe69c2b1",
    "email": "john@doe.fr",
    "password": "00000000"
}
```

When you are logged in, paste the token to the Authorize section to use the put endpoints.

A contract is created to test all the routes, with this id
``` json
{
    "_id": "653ada47b6de3307df0f560b",
},

```

## Project organisation
```bash
src
- controllers
- enum
- middleware
- models
- responses
- routes
- validation
index.ts
logger.ts
seed.ts
```
## Package Used
```json
"@types/jsonwebtoken": "^9.0.4", => JWT
"crypto-js": "^4.2.0", => Password hashing algorithm
"dotenv": "^16.3.1",
"express": "^4.18.2",
"jsonwebtoken": "^9.0.2", => JWT
"mongodb": "^6.2.0",
"mongoose": "^7.6.3",
"morgan": "^1.10.0", => Middleware
"swagger-ui-express": "^5.0.0",  => OpenAI documentation
"tsoa": "^5.1.1",  => OpenAI documentation annotation
"winston": "^3.11.0"  => Logger
```

