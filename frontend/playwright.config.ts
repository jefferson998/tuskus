import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();


export default defineConfig({
  use: {
    headless: true, //true or false
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }] 
  ],
});