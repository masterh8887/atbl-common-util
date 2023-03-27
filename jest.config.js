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
            branches: 60,
            functions: 60,
            lines: 80,
            statements: 80,
        },
    }
};
