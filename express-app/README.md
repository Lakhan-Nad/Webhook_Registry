## Express Application

The application acts as a API to access Webhook Microservice.
This express app calls the Webhook Microservice API Gateway to actually complete the requests. For now this API just does some minor validation and forwards the request and again pass response from API to client.

### Required Environment Variables

- WEBHOOK_API_BASE : base route of where webhook api is hosted (since all our endpoints in Webhook microservice are behind /webhook its value should be http://hostname:port/webhook) or this might send not found error
- POST : port to run

### Routes

---

| Method | Endpoint      | Params                 | Body                                  | Description                                   |
| ------ | ------------- | ---------------------- | ------------------------------------- | --------------------------------------------- |
| GET    | /webhook      | -                      | -                                     | List all webhooks available                   |
| POST   | /webhook      | -                      | **targetURL** - url of webhook to add | Adds new webhook to the database              |
| PUT    | /webhook/:id  | **id** - id of webhook | -                                     | Update the webhook with another URL           |
| DELETE | /webhook/:id/ | **id** - id of webhook | -                                     | Delete a webhook from database                |
| POST   | /ip           | -                      | **ipAddress** - ip address            | Triggers all available webhooks with ipAdress |

---

### How to Run

```sh
npm install
npm start
```
