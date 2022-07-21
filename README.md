# Guardian Middleware API

## Developing and testing locally

-   Setup your environment variables
-   Run the linter, formatter and basic tests

```
yarn lint
yarn format
yarn test
```

If you want to run all the tests, including the e2e tests for your config use:

```
yarn test:all
```

First, run the development server. This will default to localhost:3000 but will increment if that port is already busy.

```bash
npm run dev
# or
yarn dev
```

## Open API

The OpenAPI documentation can be found at:
http://localhost:3000/docs

The OpenAPI JSON definition can be found at:
http://localhost:3000/api/docs
