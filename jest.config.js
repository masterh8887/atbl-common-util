module.exports = {
    roots: [
        "<rootDir>/test"
    ],
    testMatch: ['**/*.spec.ts'],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    }
};
