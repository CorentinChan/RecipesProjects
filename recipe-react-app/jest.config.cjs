module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};