import axios from 'axios'
import { createRichTextRequestConfig } from './request-config'
import { MicroCmsQuery, MicroCmsListResponse } from './micro-cms'
import { DEFAULT_LOCALE, MAX_API_GET_REQUEST_LIMIT } from './constants'

export interface RichTextContent {
  id: string
  value: {
    [DEFAULT_LOCALE]: string
    [locale: string]: string
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
  const allRichTextContents: RichTextContent[] = []
  let richTextContentList: RichTextContent[] = []
  do {
    richTextContentList = await getRichTextContentList({
      limit: MAX_API_GET_REQUEST_LIMIT,
      offset: allRichTextContents.length
    })
    allRichTextContents.push(...richTextContentList)
  } while (richTextContentList.length === MAX_API_GET_REQUEST_LIMIT)
  return allRichTextContents
}
