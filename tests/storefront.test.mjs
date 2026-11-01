import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');

test('public landing page is intentionally blank and not indexed', () => {
  assert.match(html, /<body>\s*<\/body>/i);
  assert.match(html, /<meta name="robots" content="[^"]*noindex[^"]*">/i);
  assert.doesNotMatch(html, /<(?:script|img|form|button|a|iframe|video)\b/i);
});

test('retired storefront exposes no Telegram links, orders, prices, or public profile', () => {
  assert.doesNotMatch(html, /t\.me\//i);
  assert.doesNotMatch(html, /FormaNestStudio_bot|FormaNest_Assistant_bot/i);
  assert.doesNotMatch(html, /\/shopautopilot|\/shopai|Stars|checkout|brief-form/i);
});

test('historic JavaScript remains valid but is not loaded by the landing page', () => {
  assert.doesNotMatch(html, /formanest\.js|languages\.js|telegram-web-app\.js/i);
});
