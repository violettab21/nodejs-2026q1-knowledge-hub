import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      enabled: true,
      reporter: ['text'],
      exclude: ['node_modules/', 'dist/', 'coverage/'],

      thresholds: {
        branches: 85,
        lines: 90,
      },
    },
  },
});
