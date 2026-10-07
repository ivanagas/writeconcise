const { test, expect } = require('@playwright/test')
const { openApp, clearEditor, addKeyword, openSection } = require('./helpers')

const total = page => page.locator('#word-count').getByText('Total:').locator('span')
const highlighted = page => page.locator('#word-count').getByText('Highlighted:').locator('span')

test.beforeEach(async ({ page }) => {
  await openApp(page)
  await openSection(page, 'Word Count')
  await expect(total(page)).toBeVisible()
})

test('counts words as you type', async ({ page }) => {
  await clearEditor(page)
  await page.keyboard.type('one two three')
  await expect(total(page)).toHaveText('3')
  await page.keyboard.type(' four five')
  await expect(total(page)).toHaveText('5')
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await expect(total(page)).toHaveText('4')
})

test('counts highlighted words', async ({ page }) => {
  await clearEditor(page)
  await page.keyboard.type('very good, very nice, not very bad')
  await expect(highlighted(page)).toHaveText('0')
  await addKeyword(page, 'very')
  await expect(highlighted(page)).toHaveText('3')
  await addKeyword(page, 'nice')
  await expect(highlighted(page)).toHaveText('4')
})

test('counts the intro text', async ({ page }) => {
  await expect(total(page)).not.toHaveText('0')
})
