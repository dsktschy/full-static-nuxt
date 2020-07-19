import path from 'path'
import fs from 'fs-extra'
import { Module } from '@nuxt/types'
import { LocaleMessageObject } from 'vue-i18n'
import {
  getAllPlainTextContents,
  PlainTextContent
} from '../model/content/plain-text'
import {
  getAllRichTextContents,
  RichTextContent
} from '../model/content/rich-text'
import { LOCALES, LANG_DIR } from '../constants/index'

interface Options {}

const createMessages: Module<Options> = function() {
  this.nuxt.hook('build:compile', _createMessages)
}

async function _createMessages() {
  await fs.emptyDir(`src/${LANG_DIR}`)

  const [allPlainTextContents, allRichTextContents] = await Promise.all([
    getAllPlainTextContents(),
    getAllRichTextContents()
  ])
  const allTextContents: (PlainTextContent | RichTextContent)[] = [
    ...allPlainTextContents,
    ...allRichTextContents
  ]

  const outputJsonPromiseList: Promise<void>[] = []
  for (const locale of LOCALES) {
    const message: LocaleMessageObject = {}
    for (const textContent of allTextContents) {
      if (!textContent.value[locale.code]) continue
      message[textContent.id] = textContent.value[locale.code]
    }
    outputJsonPromiseList.push(
      fs.outputJSON(path.resolve(`src/${LANG_DIR}${locale.file}`), message)
    )
  }
  await Promise.all(outputJsonPromiseList)
}

export default createMessages
