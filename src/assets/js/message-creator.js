import { getAllPlainTextContents } from './plain-text-fetcher'
import { getAllRichTextContents } from './rich-text-fetcher'

export async function createMessage(locale) {
  const message = {}
  const allPlainTextContents = await getAllPlainTextContents()
  const allRichTextContents = await getAllRichTextContents()
  const allTextContents = [...allPlainTextContents, ...allRichTextContents]
  for (const textContent of allTextContents) {
    if (textContent.value[locale])
      message[textContent.id] = textContent.value[locale]
  }
  return message
}
