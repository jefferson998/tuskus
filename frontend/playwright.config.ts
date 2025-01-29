import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  use: {
    headless: true, 
    screenshot: 'only-on-failure', 
    trace: 'on-first-retry', 
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }], 
  ],
});