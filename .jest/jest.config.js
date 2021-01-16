const path = require('path')

module.exports = {
    // verbose: false,
    notify: true,
    bail: true,
    rootDir: path.join(__dirname, '../'),
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts'],
    preset: 'ts-jest/presets/js-with-ts',
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/.jest/setups/window.js'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx,js,jsx,mjs}',
        '<rootDir>/src/**/?(*.)(spec|test).{ts,tsx,js,jsx,mjs}',
    ],
    testTimeout: 20000,
    globals: {
        'ts-jest': {
            tsconfig: {
                allowJs: true,
            },
        },
    },
}
