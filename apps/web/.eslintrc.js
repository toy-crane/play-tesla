module.exports = {
  extends: ["@repo/eslint-config/next.js"],
  ignorePatterns: ["src/components/*", "src/types/generated.ts"],
  rules: {
    "no-console": "warn",
  },
};
