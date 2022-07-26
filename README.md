# Guardian Middleware API

## Developing and testing locally

### Setup your environment variables

You can copy `env.example` to get you going

```
cp env.example .env.local
```

Make sure to have the Guardian API running locally and then fill out the `GUARDIAN_API_URL` with the correct URL in your `.env.local` file.

For example:

```
GUARDIAN_API_URL=http://localhost:3000/api/v1
```

### Run the linter, formatter and basic tests

```
yarn lint
yarn format
yarn test
```

If you want to run all the tests, including the e2e tests for your config use:

```
yarn test:all
```

Run yarn and then start the development server. This will default to localhost:3000 but will increment if that port is already busy.

```bash
yarn install
yarn dev
```

## API Spec

### Recommended VSCode plugin

This OpenAPI extension provides linting and autocomplete tools for editing the Open API spec
https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi

Edit the Open API spec directly. Once happy, re-generate the Typescript types using
`yarn codegen:api`

This will auto generate Typescript types using [openapi-typescript](https://github.com/drwpow/openapi-typescript) and saves it to `./app/spec/openapi.d.ts`

This flow allows us to have a strong contract between the Open API spec and the API types. Typescript checks should avoid issues of the API moving out of sync with the documentation.

### OpenAPI

The OpenAPI documentation can be found at:
http://localhost:3000/docs

The OpenAPI JSON definition can be found at:
http://localhost:3000/api/docs
