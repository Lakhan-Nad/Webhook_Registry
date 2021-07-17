[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# backend

This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

### Required Env Variables and defaults

-   MONGO_URI=mongodb://localhost:27017/webhooks
-   LOG_LEVEL=debug
-   REDIS_URL=redis://localhost:6379
-   MONGO_WEBHOOK_COLLECTION=webhooks
-   SERVICES=dist/services

## NPM scripts

-   `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
-   `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
-   `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
-   `npm run lint`: Run ESLint
-   `npm run ci`: Run continuous test mode with watching
-   `npm test`: Run tests & generate coverage report

## Why make Trigger as a seperate service?

-   If we have many webhooks registered then triggering each of them one by one might take lot of time and adding fault tolerence as well as giving a good timeout can consume lot of time on JS main thread. If the trigger is seperate service it also allows us to independently scale that service as the demand grows. Makes our code more maintainable and frees load on the main thread.

## In the function calling the requests

-   If a request is timed out in previous timeout, then the request will be retried with the new timeout value more than last one but less than equal to `maxTimeout`.
-   If a request returns 404 in multiple requests (2 is limit in code, can be changed) then, it stops trying and fail.

## Some Mock Servers are given in mockserver folder for testing.

-   index\_[x].js file where [x] is nature of server.
-   For example index_timeout.js server won't succeed in first request because request timeout is 1000ms but server returns response in 1500ms. But for next request it will succeed bcause next time timeout of request would be 2000.
