import { IncomingMessage } from "http";
import { Service, ServiceBroker, Context } from "moleculer";
import ApiGateway from "moleculer-web";
import * as bodyParser from "body-parser";

export default class ApiService extends Service {
	public constructor(broker: ServiceBroker) {
		super(broker);
		// @ts-ignore
		this.parseServiceSchema({
			name: "api",
			mixins: [ApiGateway],
			path: "/",
			settings: {
				port: process.env.PORT || 3000,
				use: [bodyParser.json()],
				routes: [
					{
						path: "/webhook",
						mappingPolicy: "restrict",
						aliases: {
							"GET /": "webhooks.list",
							"POST /": "webhooks.register",
							"DELETE /:id": "webhooks.delete",
							"PUT /:id": "webhooks.update",
							"GET /trigger": "trigger.run",
						},
					},
				],
			},
		});
	}
}
