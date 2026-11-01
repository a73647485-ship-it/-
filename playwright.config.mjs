import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  testMatch: '*.e2e.spec.mjs',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:8020', ...devices['Desktop Chrome'], headless: true, locale: 'ru-RU' },
  webServer: {
    command: 'python3 -m http.server 8020 --bind 127.0.0.1',
    url: 'http://127.0.0.1:8020/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
