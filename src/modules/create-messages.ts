import path from 'path'
import fs from 'fs-extra'
import { Module } from '@nuxt/types'
import { LocaleMessageObject } from 'vue-i18n'
import {
  getAllPlainTextContents,
  PlainTextContent
} from '../assets/scripts/plain-text'
import {
  getAllRichTextContents,
  RichTextContent
} from '../assets/scripts/rich-text'
import { langDir, locales } from '../assets/scripts/nuxt-i18n-options'

interface Options {}

const createMessages: Module<Options> = function() {
  this.nuxt.hook('build:compile', _createMessages)
}

async function _createMessages() {
  await fs.emptyDir(`src/${langDir}`)

  const [allPlainTextContents, allRichTextContents] = await Promise.all([
    getAllPlainTextContents(),
    getAllRichTextContents()
  ])
  const allTextContents: (PlainTextContent | RichTextContent)[] = [
    ...allPlainTextContents,
    ...allRichTextContents
  ]

  const outputJsonPromiseList = []
  for (const locale of locales) {
    const message: LocaleMessageObject = {}
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

export default createMessages
