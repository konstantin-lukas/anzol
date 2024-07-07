module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    coverageReporters: ["lcov", "text"],
    collectCoverageFrom: ["**/src/hooks/*.ts"],
    verbose: true,
    bail: 1
};
