module.exports = {
  testRegex: ".e2e-spec.js$",
  transform: {
    "^.+\\.(t|j)s$": ["@swc/jest"],
  },
};
