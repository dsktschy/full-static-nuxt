import path from 'path'
import fs from 'fs-extra'
import { langDir, locales } from '../json/variables'
import { getAllPlainTextContents } from './plain-text-fetcher'
import { getAllRichTextContents } from './rich-text-fetcher'

export async function createMessages() {
  const [allPlainTextContents, allRichTextContents] = await Promise.all([
    getAllPlainTextContents(),
    getAllRichTextContents()
  ])
  const allTextContents = [...allPlainTextContents, ...allRichTextContents]
  const outputJsonPromiseList = []
  for (const locale of locales) {
    const message = {}
    for (const textContent of allTextContents) {
      if (!textContent.value[locale.code]) continue
      message[textContent.id] = textContent.value[locale.code]
    }
    outputJsonPromiseList.push(
      fs.outputJSON(path.resolve(`src/${langDir}${locale.file}`), message)
    )
  }
  await Promise.all(outputJsonPromiseList)
}
