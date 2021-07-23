## express-app

- contains express application

[See API documentation](https://github.com/Lakhan-Nad/Webhook_Registry/tree/main/express-app#readme)

The express application is the API gateway to webhooks microservice.
It provides endpoints to interact with webhooks API. 

In future we can also add authentication and authorization logic in this API gateway or as a seperate microservice without changing logic inside webhooks microservice.

## moleculer-microservice

- contains webhook microservice

[Read about Microservice](https://github.com/Lakhan-Nad/Webhook_Registry/tree/main/moleculer-microservice#readme)

The main microservice which handles CRUD for webhooks as well as call the webhook endpoints when needed.

Future scope of improvements:-

1. Calling of all webhooks can be delegated in a queue where worker processes can pickup the task and process each request.
2. Currently webhooks calling service supports following features:
    1.1 Fault Tolerant (multiple retries for each endpoint until success is returned)
    1.2 Customizable timeout with auto adjusting timeout based on previous failed request.
    1.3 Ceasing try after multiple 404 errors. (Can also extend for other http codes like 503 - Service Unavailable) 
