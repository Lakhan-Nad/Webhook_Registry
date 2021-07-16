"use strict";

import { Errors, ServiceBroker } from "moleculer";
import TestService from "../../../services/webhook.service";

describe("Test 'webhooks' service", () => {
	describe("Test actions", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService);

		jest.spyOn(service.adapter, "updateById");
		jest.spyOn(service.adapter, "insert");
		jest.spyOn(service.adapter, "removeById");

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		let id: any;

		describe("Test 'webhooks.register'", () => {
			it("should call the adapter insert method & add to database", async () => {
				service.adapter.insert.mockClear();
				const record = {
					targetURL: "https://lakhan.nad",
				};
				const res: any = await broker.call("webhooks.register", record);
				expect(res).toHaveProperty("id");
				expect(service.adapter.insert).toBeCalledTimes(1);
				id = res.id;
			});

			it("should not call the adapter insert method & return void because of invalid protocol", async () => {
				service.adapter.insert.mockClear();
				expect(async () => {
					await broker.call("webhooks.register", {
						id: "123",
						targetURL: "proto://domain.com",
					});
				}).rejects.toThrow();
				expect(service.adapter.insert).toBeCalledTimes(0);
			});
		});

		describe("Test 'webhooks.update'", () => {
			it("should return undefined if invalid id is sent", async () => {
				service.adapter.updateById.mockClear();
				expect(async () => {
					await broker.call("webhooks.update", {
						id: "111",
						targetURL: "https://lakhan.nad",
					});
				}).rejects.toThrow();
				expect(service.adapter.updateById).toBeCalledTimes(0);
			});

			it("should return new object if params is valid", async () => {
				service.adapter.updateById.mockClear();
				const result = await broker.call("webhooks.update", {
					id,
					targetURL: "https://lakhan.nad",
				});
				expect(service.adapter.updateById).toBeCalledTimes(1);
				expect(result).toStrictEqual({
					id,
					targetURL: "https://lakhan.nad",
				});
			});

			it("should throw error if params is not valid", async () => {
				expect(async () => {
					await broker.call("webhooks.update", {
						id,
					});
				}).rejects.toThrow(Errors.ValidationError);
			});
		});

		describe("Test 'webhooks.delete'", () => {
			it("should pass and delete the id", async () => {
				service.adapter.removeById.mockClear();
				const result = await broker.call("webhooks.delete", {
					id,
				});
				expect(result).toBeUndefined();
				expect(service.adapter.removeById).toBeCalledTimes(1);
			});

			it("should not throw error even if non valid id", async () => {
				expect(async () => {
					await broker.call("webhooks.delete", {
						id: "any-non-existing-id",
					});
				}).rejects.toThrow();
			});
		});
	});
});
