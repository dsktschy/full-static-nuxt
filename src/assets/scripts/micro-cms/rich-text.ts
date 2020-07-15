import axios from 'axios'
import { RichTextContent } from '../rich-text'
import { MAX_API_GET_REQUEST_LIMIT } from '../constants'
import { createRichTextRequestConfig } from './request-config'
import { MicroCmsQuery } from './query'
import { MicroCmsListResponse } from './response'

async function getRichTextContentList(params: MicroCmsQuery = {}) {
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
