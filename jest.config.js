/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.(ts|js)$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!d3|internmap|delaunator|robust-predicates)/"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
};
