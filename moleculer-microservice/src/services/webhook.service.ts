import { Context, Service, ServiceBroker, Errors } from "moleculer";

import { v4 as uuid } from "uuid";
import _ from "lodash";
import { Errors as WebErrors } from "moleculer-web";
import DBConnection from "../mixins/db.mixin";
import retryPromise from "../utils/retry";
import { validateUrl, validateUuid } from "../utils/validator";
import * as config from "../config";

class WebhookService extends Service {
	private DBMixin = new DBConnection(config.MONGO_WEBHOOK_COLLECTION).start();

	public constructor(broker: ServiceBroker) {
		super(broker);

		this.parseServiceSchema({
			name: "webhooks",
			mixins: [this.DBMixin],
			actions: {
				register: {
					cache: false,
					params: { targetURL: "string" },
					handler: this.register.bind(this),
					visibility: "published",
					hooks: {
						before: ["validateTargetURL"],
					},
				},
				list: {
					params: {},
					cache: false,
					handler: this.list.bind(this),
					visibility: "published",
				},
				delete: {
					params: { id: "string" },
					handler: this.delete.bind(this),
					cache: false,
					visibility: "published",
					hooks: {
						before: ["validateId"],
					},
				},
				update: {
					params: { id: "string", targetURL: "string" },
					cache: false,
					handler: this.update.bind(this),
					visibility: "published",
					hooks: {
						before: ["validateId", "validateTargetURL"],
					},
				},
				trigger: {
					cache: false,
					params: { ipAddress: "string" },
					handler: this.trigger.bind(this),
					visibility: "published",
					hooks: {
						before: ["startTimeHook"],
					},
				},
			},
			methods: {
				validateTargetURL: this.validateTargetURL.bind(this),
				validateId: this.validateId.bind(this),
				startTimeHook: this.startTimeHook.bind(this),
			},
		});
	}

	private async register(ctx: Context) {
		// @ts-ignore
		const { targetURL } = ctx.params;
		this.logger.debug(
			"webhooks.register",
			`Adding new Webhook: ${targetURL}`
		);
		const already = await this.adapter.find({ query: { targetURL } });
		if (!_.isEmpty(already)) {
			throw new WebErrors.InvalidRequestBodyError(null, {
				targetURL,
				message: "Webhook already exists",
			});
		}
		const insertFunction = async () => {
			try {
				const data = await this.adapter.insert({
					targetURL,
					_id: uuid(),
				});
				return data;
			} catch (err) {
				if (err.name === "MongoError" && err.code === 11000) {
					throw new Error("Duplicate key error");
				} else {
					this.logger.error("webhooks.register", err);
					throw err;
				}
			}
		};
		const result = await retryPromise(insertFunction, 5);
		// @ts-ignore
		if (result.success) {
			// @ts-ignore
			// eslint-disable-next-line no-underscore-dangle
			return { id: result.result._id };
		}
	}

	private async list(_ctx: Context) {
		const result = await this.adapter.find();
		return result;
	}

	private async update(ctx: Context) {
		// @ts-ignore
		const { id, targetURL } = ctx.params;
		const data = await this.adapter.updateById(id, { $set: { targetURL } });
		if (_.isNil(data)) {
			throw new WebErrors.BadRequestError(null, {
				id,
				message: "Id is invalid",
			});
		}
		// eslint-disable-next-line no-underscore-dangle
		return { targetURL: data.targetURL, id: data._id };
	}

	private async delete(ctx: Context) {
		// @ts-ignore
		const { id } = ctx.params;
		await this.adapter.removeById(id);
		// @ts-ignore
		ctx.meta.$statusCode = 202;
		return;
	}

	private async trigger(ctx: Context) {
		ctx.call(
			"trigger.run",
			{
				// @ts-ignore
				ip: ctx.params.ipAddress,
				startTime: Date.now(),
			},
			{
				timeout: 20000, // timeout of 20 seconds, can be increased if no of webhooks is more
				fallbackResponse(ctx, err) {
					ctx.service.logger.error(
						"webhooks.trigger",
						"fallback",
						err
					);
				},
			}
		).then(() => {});
		// @ts-ignore
		ctx.meta.$statusCode = 202;
		// @ts-ignore
		ctx.meta.$statusMessage = "Webhook Triggered";
	}

	private validateTargetURL(ctx: Context) {
		// @ts-ignore
		if (!validateUrl(ctx.params.targetURL)) {
			throw new WebErrors.BadRequestError(null, {
				// @ts-ignore
				targetURL: ctx.params.targetURL,
				message: "Invalid Url",
			});
		}
	}

	private validateId(ctx: Context) {
		// @ts-ignore
		if (!validateUuid(ctx.params.id)) {
			throw new WebErrors.BadRequestError(null, {
				// @ts-ignore
				id: ctx.params.id,
				message: "Invalid ID",
			});
		}
	}

	private startTimeHook(ctx: Context) {
		// @ts-ignore
		ctx.params.startTime = Date.now();
		return ctx;
	}
}

export default WebhookService;
