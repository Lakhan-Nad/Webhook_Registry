module.exports = {
	collectCoverage: true,
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["/node_modules/"],
	coverageProvider: "v8",
	roots: ["<rootDir>"],
	testMatch: ["<rootDir>/src/test/**/*.test.ts"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	testEnvironment: "<rootDir>/test.env.js",
	setupFilesAfterEnv: ["<rootDir>/test.setup.js"],
	testTimeout: 10000,
};
