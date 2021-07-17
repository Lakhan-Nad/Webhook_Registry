import { Context, Service, ServiceBroker, Errors } from "moleculer";

import _ from "lodash";
import { validateIP } from "../utils/validator";
import { PostRequest } from "../utils/post";

class TriggerService extends Service {
	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: "trigger",
			actions: {
				run: {
					cache: false,
					params: { ip: "string", startTime: "number" },
					handler: this.runHandle.bind(this),
					visibility: "protected",
					hooks: {
						before: ["validateIPAddress"],
						error: ["onError"],
					},
				},
			},
			methods: {
				validateIPAddress: this.validateIPAddress.bind(this),
				onError: this.onError.bind(this),
			},
		});
	}

	private async runHandle(ctx: Context) {
		// @ts-ignore
		const { ip, startTime } = ctx.params;
		const urls = await ctx.call("database.find", {});
		const post = new PostRequest(ip, startTime);
		// @ts-ignore
		for (let i = 0; i < urls.length; i += 20) {
			// @ts-ignore
			const batch = urls.slice(i, Math.min(i + 20, urls.length));
			const promises = batch.map((val: any) =>
				post.post(val.targetURL, 5)
			);
			await Promise.allSettled(promises);
		}
		return true;
	}

	private validateIPAddress(ctx: Context) {
		// @ts-ignore
		if (!validateIP(ctx.params.ip)) {
			throw new Errors.ValidationError(
				"Invalid IP Address Provided",
				null,
				// @ts-ignore
				{ ip: ctx.params.ip }
			);
		}
	}

	private onError(ctx: Context, err: Error) {
		// @ts-ignore
		this.logger.error(`${ctx.params.ip}: ${err}`);
	}
}

export default TriggerService;
