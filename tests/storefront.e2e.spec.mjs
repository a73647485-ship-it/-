import { test, expect } from '@playwright/test';

test('retired site displays a blank page without any actions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeEmpty();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('a,button,form,img,iframe,script')).toHaveCount(0);
});

test('the retired website does not advertise or open any Telegram bot', async ({ page }) => {
  await page.goto('/');
  const html = await page.content();
  expect(html).not.toMatch(/t\.me\//i);
  expect(html).not.toMatch(/FormaNestStudio_bot|FormaNest_Assistant_bot/i);
  expect(html).not.toMatch(/brief-form|Stars|checkout/i);
});
