'use strict';

module.exports = {
    rootDir: './',
    automock: false,
    preset: 'ts-jest',
    clearMocks: true,
    collectCoverage: true,
    verbose: true,
    silent: true,
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
        '/node_modules/',
    ],
    moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
    testPathIgnorePatterns: [ '/node_modules/', '__snapshots__' ],
    testMatch: [ '**/test/**/*.test.[jt]s?(x)' ],
};
