const NodeEnv = require("jest-environment-node");

const { MongoMemoryServer } = require("mongodb-memory-server");

class Env extends NodeEnv {
	constructor(config) {
		super(config);

		this.mongod = new MongoMemoryServer({
			binary: {
				checkMD5: false,
			},
			instance: {
				dbName: "test",
			},
		});
	}

	async setup() {
		await super.setup();

		await this.mongod.start();

		this.global.CONFIG__LOG_LEVEL = "debug";

		this.global.CONFIG__MONGO_URI = this.mongod.getUri();
	}

	async teardown() {
		await this.mongod.stop();
		await super.teardown();
	}

	getVmContext() {
		return super.getVmContext();
	}
}

module.exports = Env;
