import { test, expect } from '@playwright/test';

test('storefront has visible offers and valid preview assets', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work')).toBeVisible();
  await expect(page.locator('#packages')).toBeVisible();
  await expect(page.locator('#brief-form')).toBeVisible();
  await expect(page.locator('[data-sample="card"] .actual-preview img')).toHaveCount(1);
  for (const type of ['card', 'banner']) {
    for (const option of ['1', '2', '3']) {
      await page.locator(`[data-sample="${type}"] [data-preview="${option}"]`).click();
      const img = page.locator(`[data-sample="${type}"] .actual-preview img`);
      await expect(img).toHaveJSProperty('complete', true);
      expect(await img.evaluate(el => el.naturalWidth)).toBeGreaterThan(0);
    }
  }
});

test('buyer can prepare a Telegram draft without making a payment', async ({ page }) => {
  await page.goto('/');
  await page.locator('.select-package[data-package="banner"]').click();
  await expect(page.locator('#package')).toHaveValue('banner');
  await page.locator('#product').fill('Керамическая чашка');
  await page.locator('#product-price').fill('Без цены');
  await page.locator('#details').fill('Тестовая заявка. Цвет: белый. Сохраните исходную форму.');
  await page.locator('#brief-form button[type="submit"]').click();
  await expect(page.locator('#brief-result')).toBeVisible();
  const href = await page.locator('#telegram-draft-link').getAttribute('href');
  expect(href).toContain('https://t.me/FormaNestStudio_bot?text=');
  expect(decodeURIComponent(href)).toContain('Керамическая чашка');
  await expect(page.locator('#send-brief')).toBeHidden();
});

test('incomplete order is rejected before Telegram', async ({ page }) => {
  await page.goto('/');
  await page.locator('#product').fill('Тест');
  await page.locator('#details').fill('Коротко');
  await page.locator('#brief-form button[type="submit"]').click();
  await expect(page.locator('#brief-result')).toBeHidden();
  await expect(page.locator('#form-status')).toContainText('Проверьте');
});

test('locale defaults to French for a French Canadian browser and persists a choice', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'fr-CA' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await page.locator('button[data-language="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await context.close();
});

test('Telegram keyboard submission can retry after a synchronous transport failure', async ({ page }) => {
  await page.addInitScript(() => {
    window.__sent = [];
    window.__failedOnce = false;
    window.Telegram = { WebApp: {
      platform: 'android', initDataUnsafe: {},
      ready() {}, expand() {},
      sendData(payload) {
        if (!window.__failedOnce) {
          window.__failedOnce = true;
          throw new Error('simulated transport error');
        }
        window.__sent.push(JSON.parse(payload));
      }
    }};
  });
  await page.goto('/?from=bot_keyboard');
  await page.locator('#product').fill('Тестовый товар');
  await page.locator('#details').fill('Тестовая заявка. Не списывать оплату.');
  await page.locator('#brief-form button[type="submit"]').click();
  await expect(page.locator('#send-brief')).toBeVisible();
  await page.locator('#send-brief').click();
  await expect(page.locator('#send-brief')).toBeEnabled();
  await expect(page.locator('#form-status')).toContainText('не удалась');
  await page.locator('#send-brief').click();
  await expect(page.locator('#form-status')).toContainText('только после ответа бота');
  expect(await page.evaluate(() => window.__sent.length)).toBe(1);
});
