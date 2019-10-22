module.exports = {
    coverageDirectory: "./coverage/",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/src/**",
    ],
    // coverageThreshold: {
    //     "global": {
    //         "branches": 100,
    //         "functions": 100,
    //         "lines": 100,
    //         "statements": 100,
    //     }
    // },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/file-mock.js",
        "\\.(css|scss)$": "identity-obj-proxy"
    },
    rootDir: '.',
    setupFilesAfterEnv: [
        "<rootDir>/test/utils/setup-test-framework.ts"
    ],
    snapshotSerializers: [
        "enzyme-to-json/serializer"
    ],
    testMatch: ['<rootDir>/test/(unit|acceptance)/**/*.spec.ts', '<rootDir>/test/(unit|acceptance)/**/*.spec.tsx'],
    transform: {
        '\\.ts$': 'ts-jest',
        '\\.tsx$': 'ts-jest'
    }
};
