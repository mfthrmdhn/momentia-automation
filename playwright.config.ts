import { defineConfig, devices } from '@playwright/test';

import dotenv from 'dotenv';
import path from 'path';
import { workerUsers } from './src/data/workers.data';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: workerUsers.length,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
  use: {
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api-tests',
      testMatch: 'tests/api/*.ts',
      use: {
        baseURL: process.env.API_BASE_URL,
      },
    }
  ],
});
