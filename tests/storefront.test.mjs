import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const js = readFileSync('formanest.js', 'utf8');
const lang = readFileSync('languages.js', 'utf8');

test('all static local asset paths exist', () => {
  const direct = [...html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(match => match[1]);
  const previews = ['card', 'banner'].flatMap(kind => [1, 2, 3].map(index =>
    `assets/actual-${kind}-preview${index === 1 ? '' : '-' + index}.png`));
  for (const file of [...direct, ...previews]) {
    assert.ok(existsSync(file), `Missing asset: ${file}`);
  }
});

test('referenced DOM ids exist', () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of js.matchAll(/\$\('([^']+)'\)/g)) {
    if (match[1].startsWith('hero-')) continue; // optional carousel in a different layout
    assert.ok(ids.has(match[1]), `Missing DOM id: ${match[1]}`);
  }
});

test('Telegram payloads are not declared delivered before bot confirmation', () => {
  assert.match(js, /submittedRequestId=preparedPayload\.request_id/);
  assert.match(js, /catch\{\s*submittedRequestId=null/);
  assert.match(js, /только после ответа бота/);
});

test('locale selection supports French and English browser preferences', () => {
  assert.match(lang, /navigator\.languages\?\.\[0\]/);
  assert.match(lang, /preferred\.startsWith\('fr'\)/);
  assert.match(lang, /preferred\.startsWith\('en'\)/);
});
