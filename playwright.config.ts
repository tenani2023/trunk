import { defineConfig, devices } from '@playwright/test';

// Runs against the production build served by `astro preview`.
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  // WebKit は並列ワーカーで落ちることがあったため直列で実行
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4322',
    locale: 'ja-JP',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm exec astro preview --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // WebKit エミュレーション（iPhone 実機 Safari の検証ではありません）
    { name: 'webkit-mobile', use: { ...devices['iPhone 14'], viewport: { width: 390, height: 844 } } },
  ],
});
