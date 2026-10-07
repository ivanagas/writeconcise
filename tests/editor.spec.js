const { test, expect } = require('@playwright/test')
const { openApp, editor, overlay, clearEditor, expectInSync } = require('./helpers')

async function paste(page, { text, html }) {
  await editor(page).evaluate((el, { text, html }) => {
    const data = new DataTransfer()
    data.setData('text/plain', text)
    if (html) data.setData('text/html', html)
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }))
  }, { text, html })
}

test.beforeEach(async ({ page }) => {
  await openApp(page)
})

test('shows the intro text in both editor and overlay', async ({ page }) => {
  await expect(overlay(page)).toContainText('Write Concise is a tool to help you write better')
  await expectInSync(page)
})

test.describe('typing', () => {
  test('typed text appears in the overlay', async ({ page }) => {
    await clearEditor(page)
    await page.keyboard.type('Hello there, this is a test.')
    await expect(editor(page)).toHaveText('Hello there, this is a test.')
    await expect(overlay(page)).toHaveText('Hello there, this is a test.')
  })

  test('multiple lines stay in sync', async ({ page }) => {
    await clearEditor(page)
    await page.keyboard.type('First line')
    await page.keyboard.press('Enter')
    await page.keyboard.type('Second line')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.keyboard.type('Third line after a blank')
    await expectInSync(page)
    await expect(overlay(page)).toContainText('Third line after a blank')
  })

  test('editing in the middle of text stays in sync', async ({ page }) => {
    await clearEditor(page)
    await page.keyboard.type('The quick fox')
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft')
    await page.keyboard.type('brown ')
    await page.keyboard.press('End')
    await page.keyboard.press('Backspace')
    await expect(overlay(page)).toHaveText('The quick brown fo')
    await expectInSync(page)
  })

  test('html-like text is shown literally, not rendered', async ({ page }) => {
    await clearEditor(page)
    await page.keyboard.type('a <b>bold</b> & "quoted" claim')
    await expect(overlay(page)).toHaveText('a <b>bold</b> & "quoted" claim')
    await expect(overlay(page).locator('b')).toHaveCount(0)
  })

  test('clear text link empties the editor', async ({ page }) => {
    await clearEditor(page)
    await expect(overlay(page)).toHaveText('')
  })
})

test.describe('pasting', () => {
  test('pasted plain text matches what is shown', async ({ page }) => {
    await clearEditor(page)
    await paste(page, { text: 'Pasted words go here.' })
    await expect(editor(page)).toHaveText('Pasted words go here.')
    await expectInSync(page)
  })

  test('pasting rich text inserts only the plain text', async ({ page }) => {
    await clearEditor(page)
    await paste(page, { text: 'Big red words', html: '<h1 style="color:red">Big <i>red</i> words</h1>' })
    await expect(editor(page).locator('h1, i')).toHaveCount(0)
    await expect(editor(page)).toHaveText('Big red words')
    await expectInSync(page)
  })

  test('pasting multiple paragraphs stays in sync', async ({ page }) => {
    await clearEditor(page)
    await paste(page, { text: 'Paragraph one is here.\n\nParagraph two is here.\nAnd a third line.' })
    await expectInSync(page)
    await expect(overlay(page)).toContainText('Paragraph two is here.')
  })

  test('pasting into the middle of existing text stays in sync', async ({ page }) => {
    await clearEditor(page)
    await page.keyboard.type('Start end')
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowLeft')
    await paste(page, { text: 'middle ' })
    await expect(overlay(page)).toHaveText('Start middle end')
    await expectInSync(page)
  })

  test('overlay and editor take up the same space after a long paste', async ({ page }) => {
    await clearEditor(page)
    const long = Array.from({ length: 15 }, (_, i) => `Sentence number ${i} is fairly long so that it wraps across lines.`).join(' ')
    await paste(page, { text: long + '\n\n' + long })
    await expectInSync(page)
    const [editorHeight, overlayHeight] = await Promise.all([
      editor(page).evaluate(el => el.scrollHeight),
      overlay(page).evaluate(el => el.scrollHeight),
    ])
    expect(Math.abs(editorHeight - overlayHeight)).toBeLessThanOrEqual(2)
  })
})
