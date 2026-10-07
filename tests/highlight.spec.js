const { test, expect } = require('@playwright/test')
const { openApp, editor, overlay, clearEditor, expectInSync, addKeyword, openSection } = require('./helpers')

const danger = page => overlay(page).locator('span.text-danger')
const warning = page => overlay(page).locator('span.text-warning')

test.describe('keyword highlighting', () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page)
    await clearEditor(page)
    await page.keyboard.type('This is very good and very very nice. Every word is verygood.')
  })

  test('adding a keyword highlights whole-word matches', async ({ page }) => {
    await addKeyword(page, 'very')
    await expect(danger(page)).toHaveText(['very', 'very', 'very'])
    await expectInSync(page)
  })

  test('matching is case-insensitive', async ({ page }) => {
    await addKeyword(page, 'THIS')
    await expect(danger(page)).toHaveText(['This'])
  })

  test('phrases highlight', async ({ page }) => {
    await addKeyword(page, 'very nice')
    await expect(danger(page)).toHaveText(['very nice'])
  })

  test('comma-separated keywords add several at once', async ({ page }) => {
    await addKeyword(page, 'good, nice')
    await expect(danger(page)).toHaveText(['good', 'nice'])
  })

  test('keywords with regex characters do not break highlighting', async ({ page }) => {
    await addKeyword(page, '(oops')
    await addKeyword(page, 'nice')
    await expect(danger(page)).toHaveText(['nice'])
  })

  test('new typing gets highlighted', async ({ page }) => {
    await addKeyword(page, 'nice')
    await editor(page).click()
    await page.keyboard.press('ControlOrMeta+End')
    await page.keyboard.type(' So nice!')
    await expect(danger(page)).toHaveText(['nice', 'nice'])
  })

  test('removing a keyword removes its highlight', async ({ page }) => {
    await addKeyword(page, 'very')
    await expect(danger(page)).toHaveCount(3)
    await page.locator('.keyword-input__keyword', { hasText: 'very' }).locator('span').click()
    await expect(danger(page)).toHaveCount(0)
  })

  test('clear and undo', async ({ page }) => {
    await addKeyword(page, 'very')
    await page.locator('.hightlight-btn').getByText('Clear').click()
    await expect(danger(page)).toHaveCount(0)
    await page.locator('.hightlight-btn').getByText('Undo').click()
    await expect(danger(page)).toHaveCount(3)
  })

  test('keywords persist across reloads', async ({ page }) => {
    await addKeyword(page, 'good')
    await page.reload()
    await expect(page.locator('.keyword-input__keyword', { hasText: 'good' })).toBeVisible()
  })

  test('Try It highlights the example text', async ({ page }) => {
    await page.reload()
    await page.locator('.hightlight-btn').getByText('Try It').click()
    for (const word of ['very', 'pretty', 'definitely', 'important', 'a number of', 'I believe', 'nice']) {
      await expect(danger(page).filter({ hasText: new RegExp(`^${word}$`, 'i') }).first()).toBeVisible()
    }
    await expectInSync(page)
  })

  test('clicking an uncommon word highlights it', async ({ page }) => {
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.type('Banana bread with banana and more banana.')
    const chip = page.locator('.uncommon-word', { hasText: 'banana (3)' })
    await expect(chip).toBeVisible()
    await chip.click()
    await expect(danger(page)).toHaveText(['Banana', 'banana', 'banana'])
  })
})

test.describe('more checks', () => {
  const text = "I can't believe it's really quickly done. Don’t rely on it. Ugly."

  test.beforeEach(async ({ page }) => {
    await openApp(page)
    await clearEditor(page)
    await page.keyboard.type(text)
    await openSection(page, 'More Checks')
  })

  test('highlights contractions when turned on', async ({ page }) => {
    await expect(warning(page)).toHaveCount(0)
    await page.locator('label[for=contractionSwitch]').click()
    await expect(page.locator('#contractionSwitch')).toBeChecked()
    await expect(warning(page)).toHaveText(["can't", "it's", 'Don’t'])
    await expectInSync(page)

    await page.locator('label[for=contractionSwitch]').click()
    await expect(warning(page)).toHaveCount(0)
  })

  test('highlights -ly words when turned on', async ({ page }) => {
    await page.locator('label[for=lyWordsSwitch]').click()
    await expect(page.locator('#lyWordsSwitch')).toBeChecked()
    await expect(warning(page)).toHaveText(['really', 'quickly', 'rely', 'Ugly'])
    await expectInSync(page)

    await page.locator('label[for=lyWordsSwitch]').click()
    await expect(warning(page)).toHaveCount(0)
  })

  test('both checks together with a keyword', async ({ page }) => {
    await page.locator('label[for=contractionSwitch]').click()
    await page.locator('label[for=lyWordsSwitch]').click()
    await addKeyword(page, 'done')
    await expect(warning(page)).toHaveCount(7)
    await expect(danger(page)).toHaveText(['done'])
    await expectInSync(page)
  })

  test('check settings persist across reloads', async ({ page }) => {
    await page.locator('label[for=contractionSwitch]').click()
    await page.reload()
    await openSection(page, 'More Checks')
    await expect(page.locator('#contractionSwitch')).toBeChecked()
    await expect(page.locator('#lyWordsSwitch')).not.toBeChecked()
  })
})

test('typing a comma adds the keyword', async ({ page }) => {
  await openApp(page)
  await clearEditor(page)
  await page.keyboard.type('good and nice')
  const input = page.getByPlaceholder('Enter a word or phrase')
  await input.click()
  await input.pressSequentially('nice,')
  await expect(input).toHaveValue('')
  await expect(page.locator('.keyword-input__keyword', { hasText: 'nice' })).toBeVisible()
  await expect(danger(page)).toHaveText(['nice'])
})

test('long keyword shows a dismissible warning', async ({ page }) => {
  await openApp(page)
  await addKeyword(page, 'this is a really long keyword phrase')
  const alert = page.locator('.alert-danger')
  await expect(alert).toContainText("That's a long keyword")
  await alert.locator('.close').click()
  await expect(alert).toHaveCount(0)
})
