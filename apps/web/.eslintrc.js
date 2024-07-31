module.exports = {
  extends: ["@repo/eslint-config/next.js"],
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
  },
  ignorePatterns: ["src/components/*", "src/types/generated.ts"],
};
