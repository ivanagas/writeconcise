const { test, expect } = require('@playwright/test')
const { openApp, editor, overlay, clearEditor, expectInSync, addKeyword } = require('./helpers')

test.beforeEach(async ({ page }) => {
  await openApp(page)
})

test('no horizontal scrolling', async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('editor fits the screen and sits above the sidebar', async ({ page }) => {
  const viewport = page.viewportSize()
  const box = await editor(page).boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(0)
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1)
  expect(box.width).toBeGreaterThan(viewport.width * 0.7)

  const input = await page.getByPlaceholder('Enter a word or phrase').boundingBox()
  expect(input.y).toBeGreaterThan(box.y)
  expect(input.x + input.width).toBeLessThanOrEqual(viewport.width + 1)
})

test('editor and overlay line up', async ({ page }) => {
  const [a, b] = await Promise.all([editor(page).boundingBox(), overlay(page).boundingBox()])
  expect(Math.abs(a.x - b.x)).toBeLessThanOrEqual(1)
  expect(Math.abs(a.y - b.y)).toBeLessThanOrEqual(1)
  expect(Math.abs(a.width - b.width)).toBeLessThanOrEqual(1)
})

test('tap to type and highlight', async ({ page }) => {
  await clearEditor(page)
  await editor(page).tap()
  await page.keyboard.type('This is a very short note.')
  await expectInSync(page)
  await addKeyword(page, 'very')
  await expect(overlay(page).locator('span.text-danger')).toHaveText(['very'])
})

test('screenshot', async ({ page }, testInfo) => {
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true })
})
