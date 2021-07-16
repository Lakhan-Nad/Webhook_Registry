"use strict";

import { ServiceBroker } from "moleculer";
import TestService from "../../services/webhook.service";

describe("Test 'webhooks' service", () => {
	describe("Test actions", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService);
		service.seedDB = null; // Disable seeding

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		const record = {
			targetURL: "https://www.vit.in",
		};
		let newID: string;

		it("should not contains the seeded items", async () => {
			const res = await broker.call("webhooks.list");
			expect(res).toHaveLength(0);
		});

		it("should add the new item", async () => {
			const res: any = await broker.call("webhooks.register", record);
			expect(res).toStrictEqual({
				id: expect.any(String),
			});
			newID = res.id;
			const res2 = await broker.call("webhooks.list");
			expect(res2).toHaveLength(1);
		});

		it("should update an item", async () => {
			const res = await broker.call("webhooks.update", {
				id: newID,
				targetURL: "http://somenew.com",
			});
			expect(res).toStrictEqual({
				id: newID,
				targetURL: "http://somenew.com",
			});
		});

		it("should remove the updated item", async () => {
			const res = await broker.call("webhooks.delete", { id: newID });
			expect(res).toBeUndefined();
			const res2 = await broker.call("webhooks.list");
			expect(res2).toHaveLength(0);
		});
	});
});
