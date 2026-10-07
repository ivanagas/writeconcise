const { expect } = require('@playwright/test')

// Block analytics so tests don't send events, and start each test fresh.
async function openApp(page, { storage = {} } = {}) {
  await page.route(/posthog\.com/, route => route.abort())
  await page.addInitScript(values => {
    if (!sessionStorage.getItem('__seeded')) {
      localStorage.clear()
      for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value)
      sessionStorage.setItem('__seeded', '1')
    }
  }, storage)
  await page.goto('/')
  await expect(page.locator('#good-input')).toBeVisible()
}

const editor = page => page.locator('#good-input')
const overlay = page => page.locator('#input-overlay')

async function clearEditor(page) {
  await page.locator('#good-input .clear-text').click()
  await expect(editor(page)).toHaveText('')
  await editor(page).click()
}

// The editor text is transparent; what the user sees is the overlay.
// Both should hold the same text.
async function expectInSync(page) {
  await expect.poll(async () => {
    const [a, b] = await Promise.all([
      editor(page).evaluate(el => el.innerText),
      overlay(page).evaluate(el => el.innerText),
    ])
    const norm = s => s.replace(/\u00a0/g, ' ').replace(/\n+/g, '\n').trim()
    return norm(a) === norm(b) ? 'in sync' : `editor=${JSON.stringify(a)} overlay=${JSON.stringify(b)}`
  }).toBe('in sync')
}

async function addKeyword(page, word) {
  const input = page.getByPlaceholder('Enter a word or phrase')
  await input.fill(word)
  await input.press('Enter')
}

async function openSection(page, title) {
  await page.locator('h4', { hasText: title }).click()
}

module.exports = { openApp, editor, overlay, clearEditor, expectInSync, addKeyword, openSection }
