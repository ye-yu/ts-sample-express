module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "(\\..*)\\.js$": "$1",
  },
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
};
