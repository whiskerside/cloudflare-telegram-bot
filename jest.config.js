module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  setupFiles: ["./jest.setup.js"],
};
