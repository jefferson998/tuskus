import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true, //true or false
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }] 
  ],
});