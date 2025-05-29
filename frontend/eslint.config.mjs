// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      js,
      vue: pluginVue,
    },
    rules: {
      // You can add your custom rules here
    },
    extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  },
]);
