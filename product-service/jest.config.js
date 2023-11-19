module.exports = {
	testEnvironment: 'node',
	roots: ['<rootDir>/test'],
	testMatch: ['**/*.test.js'],
	collectCoverageFrom: ['lambda-handler/**/*.{js,ts}'],
	coverageDirectory: 'coverage',
	testMatch: ['<rootDir>/test/**/*.test.js'],
	testEnvironment: 'node',
};
