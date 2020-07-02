import path from 'path'
import fs from 'fs-extra'
import { langDir, locales } from '../assets/json/variables'
import { getAllPlainTextContents } from '../assets/js/plain-text-fetcher'
import { getAllRichTextContents } from '../assets/js/rich-text-fetcher'

async function createMessages() {
  const [allPlainTextContents, allRichTextContents] = await Promise.all([
    getAllPlainTextContents(),
    getAllRichTextContents()
  ])
  const allTextContents = [...allPlainTextContents, ...allRichTextContents]

  await fs.ensureDir(`src/${langDir}`)

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

export default function() {
  this.nuxt.hook('build:compile', createMessages)
}
