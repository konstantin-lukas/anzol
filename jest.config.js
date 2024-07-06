module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["html", "text"],
    testMatch: ["**/tests/*.test.ts"],
    verbose: true,
    bail: 1
};
