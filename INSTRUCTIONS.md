# Nicolas Gretten backend test

## Installation
To set up this project, you'll need [pnpm](https://pnpm.io/). If you don't have it installed, you can do so by running:
```bash
npm i -g pnpm
```

Next, clone the repository and install the project dependencies:
```bash
pnpm i
```

Create the .env file using the provided sample:
```bash
cp .env.sample .env
```

## MongoDB
To run a MongoDB instance, navigate to the root of the directory and execute:
```bash
docker compose up -d
```

## Running the project
To run tests:
```bash
pnpm run test
```

To start the application in development mode:
```bash
pnpm run dev
```

You can access the Swagger documentation at the following [URL](localhost:3000/docs).

A seed of the database is performed. Two users are created, and you can use the following credentials to log in:

User 1:
``` json
{
    "_id": "653ab2966484ef549fa00700",
    "email": "felix@visionspol.eu",
    "password": "00000000"
}
```

User 2:
``` json
{
    "_id": "653a4f1d421a5f6dfe69c2b1",
    "email": "john@doe.fr",
    "password": "00000000"
}
```

Once logged in, paste the token into the "Authorize" section to use the PUT endpoints. A contract is created to test all the routes with this ID:
``` json
{
    "_id": "653ada47b6de3307df0f560b",
},

```

## Project organisation
The project is organized as follows:
```bash
__tests__
- controllers
- routes
src
- controllers
- enums
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
Here are the packages used in the project:
```json
"@types/jsonwebtoken": "^9.0.4" (JWT)
"crypto-js": "^4.2.0" (Password hashing algorithm)
"dotenv": "^16.3.1"
"express": "^4.18.2"
"jsonwebtoken": "^9.0.2" (JWT)
"mongodb": "^6.2.0"
"mongoose": "^7.6.3"
"morgan": "^1.10.0" (Middleware)
"swagger-ui-express": "^5.0.0" (OpenAPI documentation)
"tsoa": "^5.1.1" (OpenAPI documentation annotation)
"winston": "^3.11.0" (Logger)
```

Make sure to follow these steps to set up and run the project. Good luck!