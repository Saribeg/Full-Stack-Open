import { request } from '@playwright/test';

export async function resetDb(backendURL) {
  const ctx = await request.newContext({ baseURL: `${backendURL}/api/test` });
  await ctx.post('/reset');
  await ctx.dispose();
}

export async function seedDb(backendURL) {
  const ctx = await request.newContext({ baseURL: `${backendURL}/api/test` });
  const res = await ctx.post('/initiate-db');
  const data = await res.json();
  await ctx.dispose();
  return data;
}
