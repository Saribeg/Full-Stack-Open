const { test, describe, expect } = require('@playwright/test')

describe('Pokedex', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('')
    await expect(page.getByText('ivysaur')).toBeVisible()
    await expect(page.getByText('Pokémon and Pokémon character names are trademarks of Nintendo.')).toBeVisible()
  })

  test('pockemon page can be navigated to', async ({ page }) => {
    await page.goto('')
    await expect(page.getByText('charizard')).toBeVisible()
    await page.getByText('charizard').click('')
    await expect(page.locator('tr', { hasText: 'speed' })).toContainText('100')
    await expect(page.locator('tr', { hasText: 'special defense' })).toContainText('85')
    await expect(page.locator('tr', { hasText: 'special attack' })).toContainText('109')
    await expect(
      page.locator('tr', { has: page.locator('td.pokemon-stats-name', { hasText: /^defense$/ }) })
    ).toContainText('78')
    await expect(
      page.locator('tr', { has: page.locator('td.pokemon-stats-name', { hasText: /^attack$/ }) })
    ).toContainText('84')
    await expect(page.locator('tr', { hasText: 'hp' })).toContainText('78')
    await expect(page.locator('.pokemon-ability-name')).toHaveText(['blaze', 'solar power'])
  })
})