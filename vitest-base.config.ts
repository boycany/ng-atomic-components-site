// Learn more about Vitest configuration options at https://vitest.dev/config/

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'src/app/shared/components/atomic-link/atomic-link.ts',
        'src/app/shared/components/atomic-button/atomic-button.ts',
      ], // Exclude files that are primarily for rendering and have minimal logic, making them less critical for coverage metrics.
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        lines: 95,
        statements: 95,
        functions: 95,
        branches: 80,
      },
    },
  },
});
