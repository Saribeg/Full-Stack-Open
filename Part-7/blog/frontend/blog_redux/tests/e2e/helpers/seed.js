import { request } from '@playwright/test';

async function logResponse(res, label) {
  if (!res.ok()) {
    const body = await res.text().catch(() => '');
    console.error(`❌ ${label} failed: ${res.status()} ${res.statusText()}`);
    console.error(`URL: ${res.url()}`);
    console.error(`Body: ${body}`);
  }
}

function normalize(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

export async function resetDb(backendURL) {
  const ctx = await request.newContext({ baseURL: normalize(backendURL) });
  const res = await ctx.post('test/reset');
  await logResponse(res, 'test/resetDb');
  await ctx.dispose();
}

export async function seedDb(backendURL) {
  const ctx = await request.newContext({ baseURL: normalize(backendURL) });
  const res = await ctx.post('test/initiate-db');
  await logResponse(res, 'test/initiate-db');
  const data = res.ok() ? await res.json() : null;
  await ctx.dispose();
  return data;
}
