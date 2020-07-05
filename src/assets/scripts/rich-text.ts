import axios from 'axios'
import { richTextPerRequest } from '../json/variables.json'
import { createRichTextRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { defaultLocale } from './nuxt-i18n-options'

export interface RichTextContent {
  id: string
  value: {
    [defaultLocale]: string
    [key: string]: string
  }
}

export async function getRichTextContentList(params: MicroCmsQuery = {}) {
  const config = createRichTextRequestConfig(params)
  const response = await axios.get<MicroCmsListResponse<RichTextContent>>(
    '',
    config
  )
  return response.data.contents
}

export async function getAllRichTextContents() {
  const allRichTextContents = []
  let richTextContentList = []
  do {
    richTextContentList = await getRichTextContentList({
      limit: richTextPerRequest,
      offset: allRichTextContents.length
    })
    allRichTextContents.push(...richTextContentList)
  } while (richTextContentList.length === richTextPerRequest)
  return allRichTextContents
}
