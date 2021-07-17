import { Service, ServiceBroker } from "moleculer";

import _ from "lodash";
import DBConnection from "../mixins/db.mixin";
import * as config from "../config";

class WebhookService extends Service {
	private DBMixin = new DBConnection(config.MONGO_WEBHOOK_COLLECTION).start();

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: "database",
			mixins: [this.DBMixin],
		});
	}
}

export default WebhookService;
