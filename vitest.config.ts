import { defineConfig } from "vitest/config"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath } from "node:url"

/**
 * Vitest configuration for unit testing Vue 3 components and composables.
 *
 * Configuration decisions:
 * - Using happy-dom for faster DOM simulation (suitable for Vue components)
 * - Code coverage enabled with c8 at 80% threshold
 * - Vue plugin enabled for .vue component testing
 * - Alias paths configured to match Nuxt defaults (~/ maps to app/)
 */
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      all: true,
      include: ["app/**/*.{ts,vue}"],
      exclude: ["node_modules/", "app/.nuxt/", "**/*.spec.ts", "**/*.test.ts"],
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
})
