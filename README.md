# Visions Technical Test

## Installation and getting started

We use pnpm for managing packages. No compatibility issues were found in the packages we use with pnpm yet.

If you don't have pnpm installed you simply need to run
```bash
npm i -g pnpm
```

After cloning the repo, run 
```bash
pnpm i
```
to install packages.

Don't forget to set your env variables based on the .env.sample provided
```bash
cp .env.sample .env
```

## Basic CRUD REST API for a contractualisation service

**Objective:**
Evaluate the candidate's skills in designing and implementing a REST API using TypeScript, Express, and MongoDB, with a specific focus on contractualization for data exchanges.

**Test Description:**
The candidate will be responsible for developing a basic REST API for a contractualization service, implementing CRUD operations. The contract model includes the following fields:

- Data Provider : participant providing the target resource
- Data Consumer : participant consuming the target resource
- Data Provider Signature : Signature from the data provider. For the test, this can be a boolean.
- Data Consumer Signature : Signature from the data consumer. For the test, this can be a boolean.
- Terms and Conditions (using the ODRL model) : policy[] -> [example policy](./resources/policy.json)
- Target (URI of a resource pointing to a dataset) : string -> ex: http://company.com/dataset/1
- Status : "pending" | "signed" | "revoked"
- Creation timestamp : Datetime
- Update timestamp : Datetime

The candidate is also required to create a MongoDB schema to represent these contracts.

**Tasks:**

1. Set up a RESTful API using TypeScript and Express.
2. Implement CRUD operations for the contractualization service.
3. Define a MongoDB schema for storing contracts.
4. Integrate participant and contract status management.
5. Allow the creation of contracts with Terms and Conditions using the provided ODRL model.
6. Integrate logs (can be local) for the application.
7. Implement tests for the required endpoints.

**Required Endpoints to implement**
- GET all contracts
- GET a contract by ID
- POST to create a contract
- PUT to sign a contract. You have the choice of how you wish to implement the logic of verification of with participant is making the request.
- DELETE to revoke a contract

**BONUS endpoints to implement**
- Extension to GET all contracts to be able to filter by participant / status / timestamp
- Addition of basic authentication using JWT for participants -> to put in place at least for the PUT endpoint for signing
- Add middleware for payload validation
- Add swagger documentation for the API 

The candidate must provide well-structured code, follow best development practices, and comment on the code as needed. The documentation should be clear and concise.

**Candidate Instructions:**

1. Clone the provided Git repository.
2. Create a branch for development.
3. Implement the requested features.
4. Provide documentation on how to run the application locally in a INSTRUCTIONS.md file at the root of the project.
5. Submit a pull request once the test is completed.

Good luck!