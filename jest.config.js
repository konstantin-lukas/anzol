module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    collectCoverageFrom: ["**/src/hooks/*.ts"],
    verbose: true,
    bail: 1
};
