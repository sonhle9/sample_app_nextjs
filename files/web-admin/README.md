# Admin Portal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).
This was initially an angular project and we are moving it into React bit by bit.

## Getting Started

### Development server

Setup

```
export NPM_AUTH_TOKEN=e6bcb8f4-8476-4721-a1f7-eaea296fa55b
nvm install
npm install
```

Run `npm start` for dev.
Navigate to `http://localhost:4200/`

Use the username and password below:

Username: setel-admin@email.com
Password: SuperSecretKeyPassword

#### Overriding Environment Variable (including enterprise)

1. Add a `.environment.local.ts` file in `src/environments` folder and copying the content for the environment that you want into this file. For instance, if you want to run `development` site for `pdb` enterprise, copy the content of `environment.pdb.ts` into this file
1. Execute `npm run local` command in your command prompt.

### Build

Run `npm run build:dev` to build the project.
The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io/).

Run `npm run test:ci` to execute the unit tests with test coverage reports.

### Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

### Generate Test Coverage Report

Execute [`e2e-test.sh`](e2e-test.sh) which will run both unit tests and end-to-end tests and combine the coverage reports.

> Note: Windows user can use Git Bash to execute the script.

## Writing Tests

### Writing unit tests

The test files should be placed in `src` folder and named following the convention `**.test.ts`, instead of the default convention `**.spec.ts`.

Test files named following the convention `**.spec.ts` are unmaintained and should be slowly removed from this project.

### Writing end-to-end-tests

The test files should be placed in `cypress/integration` folder and named following the convention `**.spec.ts`.

Prefer using [`Cypress Testing Library`](https://testing-library.com/docs/cypress-testing-library/intro/) to get element.

## URL

### Setel

- Dev: https://dev-admin.setel.my/
- Staging: https://staging-admin.setel.my/
- Preprod: https://pre-prod-admin.setel.my/
- Prod: https://admin.setel.my/

### PDB

- Dev: https://dev-pdbadmin.setel.my/
- Staging: https://staging-pdbadmin.setel.my/
- Preprod: https://preprod-pdbadmin.setel.my/
- Prod: https://pdbadmin.setel.my/
