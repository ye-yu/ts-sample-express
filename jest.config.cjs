module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "(\\..*)\\.js$": "$1",
  },
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "@swc/jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
